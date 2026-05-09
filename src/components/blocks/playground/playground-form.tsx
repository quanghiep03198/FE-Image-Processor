import { useGetProfileQuery } from '@/apis/auth/hooks'
import { useSaveImageMutation } from '@/apis/images/hooks'
import { uploadImage } from '@/apis/images/rpc/upload'
import { SLIDER_CONFIGS } from '@/configs/playground.config'
import { useImagePreview, type PreviewParams } from '@/hooks/use-image-preview'
import { useHotkey } from '@tanstack/react-hotkeys'
import { useHydrated } from '@tanstack/react-router'
import { ImageUpIcon, LockIcon } from 'lucide-react'
import { useEffect, useReducer, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from '../../ui/field'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../ui/hover-card'
import { Slider } from '../../ui/slider'
import { Spinner } from '../../ui/spinner'

const DEFAULT_PARAMS: PreviewParams = {
  blur: 0,
  sharpen: 0,
  enhance: 0,
  denoise: 0,
  brightness: 0,
  grayscale: 0,
  contrast_bias: 0,
  threshold: 0,
  log_transform: 0,
  power_law: 0,
  webp_quality: 100,
}

type PreviewUiState = {
  hasPreview: boolean
  isUploading: boolean
  isUploadError: boolean
}

type PreviewUiAction =
  | { type: 'UPLOAD_START' }
  | { type: 'UPLOAD_SUCCESS' }
  | { type: 'UPLOAD_ERROR' }
  | { type: 'CLEAR_PREVIEW' }
  | { type: 'SHOW_PREVIEW' }

const initialPreviewUiState: PreviewUiState = {
  hasPreview: false,
  isUploading: false,
  isUploadError: false,
}

const previewUiReducer = (state: PreviewUiState, action: PreviewUiAction): PreviewUiState => {
  switch (action.type) {
    case 'UPLOAD_START':
      return { ...state, isUploading: true, isUploadError: false }
    case 'UPLOAD_SUCCESS':
      return { ...state, isUploading: false, isUploadError: false }
    case 'UPLOAD_ERROR':
      return { ...state, isUploading: false, isUploadError: true }
    case 'CLEAR_PREVIEW':
      return { hasPreview: false, isUploading: false, isUploadError: false }
    case 'SHOW_PREVIEW':
      return { ...state, hasPreview: true }
    default:
      return state
  }
}

const PlaygroundForm: React.FC = () => {
  const { data: user } = useGetProfileQuery()

  const [sessionId, setSessionId] = useState<string | null>(null)
  const [previewUi, dispatchPreviewUi] = useReducer(previewUiReducer, initialPreviewUiState)
  const [displayValues, setDisplayValues] = useState<PreviewParams>({ ...DEFAULT_PARAMS })
  const localPreviewUrlRef = useRef<string | null>(null)

  const inputFileRef = useRef<HTMLInputElement | null>(null)
  const paramsRef = useRef<PreviewParams>({ ...DEFAULT_PARAMS })

  const sendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { imgRef, isConnected, fps, sendParams } = useImagePreview(sessionId)
  const { mutateAsync, isPending } = useSaveImageMutation()

  const hyderated = useHydrated()

  useEffect(() => {
    return () => {
      if (sendTimerRef.current) {
        clearTimeout(sendTimerRef.current)
      }

      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current)
        localPreviewUrlRef.current = null
      }
    }
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return

    const oldSessionId = sessionId
    e.currentTarget.value = ''

    // Keep local preview stable while switching files by tearing down the old preview session first.
    setSessionId(null)
    handleReset(false)

    // Show local file immediately while upload is in progress
    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current)
      localPreviewUrlRef.current = null
    }

    const localUrl = URL.createObjectURL(file)
    if (imgRef.current) imgRef.current.src = localUrl
    localPreviewUrlRef.current = localUrl
    dispatchPreviewUi({ type: 'SHOW_PREVIEW' })

    dispatchPreviewUi({ type: 'UPLOAD_START' })
    try {
      const response = await uploadImage(file, oldSessionId)
      if (!response?.session_id) throw new Error('Invalid response from server')
      setSessionId(response.session_id)
      dispatchPreviewUi({ type: 'UPLOAD_SUCCESS' })
    } catch {
      dispatchPreviewUi({ type: 'UPLOAD_ERROR' })
    }
  }

  const handleSaveImage = async () => {
    if (!user) return toast.error('You need to sign in to save images')

    try {
      await mutateAsync(sessionId!)
      toast.success('Image saved successfully!')
      handleReset()
      setSessionId(null)
      dispatchPreviewUi({ type: 'CLEAR_PREVIEW' })
      if (imgRef.current) imgRef.current.src = ''
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current)
        localPreviewUrlRef.current = null
      }
      if (inputFileRef.current) {
        inputFileRef.current.value = ''
        inputFileRef.current.files = null
      }
    } catch {
      toast.error('Failed to save image. Please try again.')
    }
  }

  const handleSliderChange = (key: keyof PreviewParams, values: number | readonly number[]) => {
    const value = Array.isArray(values) ? (values as number[])[0] : (values as number)
    paramsRef.current = { ...paramsRef.current, [key]: value }
    sendParams(paramsRef.current)
  }

  const handleReset = (syncPreview = true) => {
    paramsRef.current = { ...DEFAULT_PARAMS }
    setDisplayValues({ ...DEFAULT_PARAMS })
    if (syncPreview) {
      sendParams(paramsRef.current)
    }
  }

  useHotkey('Mod+S', () => {
    if (!user) {
      toast.error('You need to sign in to save images')
      return
    }

    if (!previewUi.hasPreview || isPending) return

    handleSaveImage()
  })

  return (
    <div className="mx-auto grid h-[100cqh] w-full max-w-full flex-1 grid-cols-[auto_384px] items-stretch gap-6 overflow-hidden">
      {/* Upload error */}

      {/* Left column — preview */}
      <div className="relative flex max-h-full items-center justify-center overflow-hidden rounded-md border bg-muted">
        <label
          aria-busy={!hyderated}
          className="flex h-full w-full flex-1 cursor-pointer items-center justify-center aria-busy:cursor-progress aria-busy:opacity-80"
        >
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="invisible absolute"
            ref={inputFileRef}
            onChange={handleFileChange}
          />

          <img
            aria-hidden={!previewUi.hasPreview}
            ref={imgRef}
            className="h-full max-h-full w-full max-w-7xl object-contain object-center aria-hidden:hidden"
            alt="Preview"
          />

          {!previewUi.hasPreview && (
            <span
              aria-invalid={previewUi.isUploadError}
              className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground aria-invalid:text-destructive!"
            >
              <ImageUpIcon />
              Upload your image
            </span>
          )}
        </label>

        {/* Uploading overlay */}
        {previewUi.isUploading && (
          <div className="absolute inset-0 z-20 grid place-content-center bg-neutral-900/50 backdrop-blur-xs">
            <Spinner className="stroke-neutral-50" />
          </div>
        )}

        {/* Debug bar */}
        {sessionId && (
          <div className="absolute top-0 right-0 flex items-center gap-2 rounded-bl-[inherit] bg-neutral-950/50 px-3 py-1 text-xs text-neutral-50 backdrop-blur-sm">
            <span
              className={`size-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
              aria-label={isConnected ? 'Connected' : 'Disconnected'}
            />
            <span>{fps} FPS</span>
          </div>
        )}
      </div>
      {/* Right column — controls */}
      <FieldSet className="h-full basis-1/3 overflow-hidden pr-2 xl:basis-1/4">
        <FieldLegend>Enhancement</FieldLegend>
        <FieldDescription>Adjust the enhancement level to improve the overall quality of your image.</FieldDescription>
        <FieldSeparator />

        <FieldGroup className="max-h-full flex-1 overflow-y-auto pr-1 scrollbar-track-transparent">
          {SLIDER_CONFIGS.map(({ key, label, min, max, step, description }) => (
            <HoverCard key={key}>
              <HoverCardTrigger>
                <Field>
                  <FieldLabel className="flex justify-between">
                    {label}
                    <Badge variant="outline" render={<small>{displayValues[key]}</small>} />
                  </FieldLabel>
                  <Slider
                    key={`${key}-${sessionId}`}
                    defaultValue={[DEFAULT_PARAMS[key]]}
                    value={[displayValues[key]]}
                    min={min}
                    max={max}
                    step={step}
                    disabled={!previewUi.hasPreview}
                    onValueChange={(values) => setDisplayValues((prev) => ({ ...prev, [key]: values }))}
                    onValueCommitted={(values) => handleSliderChange(key, values)}
                  />
                </Field>
              </HoverCardTrigger>
              <HoverCardContent side="left" align="start">
                {description}
              </HoverCardContent>
            </HoverCard>
          ))}
        </FieldGroup>
        <FieldGroup>
          <Field orientation="horizontal" className="justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleReset()}>
              Reset
            </Button>
            <Button type="button" onClick={() => handleSaveImage()} disabled={!previewUi.hasPreview || isPending}>
              {!user && <LockIcon className="size-4" />}
              {isPending && <Spinner />}
              {!user ? 'Sign in to save' : 'Save'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}

export default PlaygroundForm
