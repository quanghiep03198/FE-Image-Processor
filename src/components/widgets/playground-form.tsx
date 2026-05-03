import { useImagePreview, type PreviewParams } from '@/hooks/use-image-preview'
import { uploadImage } from '@/rpc/upload'
import { ImageUpIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from '../ui/field'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Slider } from '../ui/slider'
import { Spinner } from '../ui/spinner'

type SliderConfig = {
  key: keyof Omit<PreviewParams, 'jpeg_quality'>
  label: string
  min: number
  max: number
  step: number
  description: string
}

const SLIDER_CONFIGS: SliderConfig[] = [
  {
    key: 'brightness',
    label: 'Brightness',
    min: -1,
    max: 1,
    step: 0.01,
    description:
      'Adjust the brightness level to make the image lighter or darker. Increasing brightness can help reveal details in dark areas, while decreasing it can reduce overexposure in bright areas.',
  },
  {
    key: 'grayscale',
    label: 'Grayscale',
    min: 0,
    max: 1,
    step: 0.01,
    description:
      'Convert the image to grayscale by adjusting the intensity of the colors. A value of 0 will keep the original colors, while a value of 1 will convert the image to complete grayscale.',
  },
  {
    key: 'denoise',
    label: 'Denoise',
    min: 0,
    max: 5,
    step: 0.01,
    description:
      'Reduce the amount of noise in the image, which can help improve the overall quality and clarity. Increasing the denoise level can help smooth out grainy or pixelated areas, but be careful not to overdo it, as it can also lead to a loss of detail.',
  },
  {
    key: 'contrast_bias',
    label: 'Contrast',
    min: -100,
    max: 100,
    step: 0.1,
    description:
      'Adjust the contrast bias to enhance or reduce the contrast in the image. Increasing the contrast bias can make the dark areas darker and the bright areas brighter, while decreasing it can create a more muted and softer look.',
  },
  // {
  //   key: 'blur',
  //   label: 'Blur',
  //   min: 0,
  //   max: 5,
  //   step: 0.01,
  //   description: 'It can be used to create a softening effect, reduce noise, or create a sense of motion in the image.',
  // },

  {
    key: 'enhance',
    label: 'Enhance',
    min: 0,
    max: 5,
    step: 0.01,
    description:
      'Improve the overall quality of the image by adjusting various parameters such as contrast, saturation, and color balance. Increasing the enhance level can help make the image more vibrant and visually appealing.',
  },
]

const DEFAULT_PARAMS: PreviewParams = {
  blur: 0,
  sharpen: 0,
  enhance: 0,
  denoise: 0,
  brightness: 0,
  grayscale: 0,
  contrast_bias: 0,
  jpeg_quality: 100,
}

const PlaygroundForm = () => {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [hasPreview, setHasPreview] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<boolean>(false)
  const paramsRef = useRef<PreviewParams>({ ...DEFAULT_PARAMS })
  const [displayValues, setDisplayValues] = useState<PreviewParams>({ ...DEFAULT_PARAMS })

  const { imgRef, prevUrlRef, isConnected, fps, sendParams } = useImagePreview(sessionId)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return

    // Show local file immediately while upload is in progress
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current)
    }
    const localUrl = URL.createObjectURL(file)
    if (imgRef.current) imgRef.current.src = localUrl
    prevUrlRef.current = localUrl
    setHasPreview(true)

    setIsUploading(true)
    setUploadError(false)
    try {
      const { session_id } = await uploadImage(file, sessionId)
      setSessionId(session_id)
    } catch {
      setUploadError(true)
    } finally {
      setIsUploading(false)
      setUploadError(false)
    }
  }

  const handleSliderChange = (key: keyof PreviewParams, values: number | readonly number[]) => {
    const value = Array.isArray(values) ? (values as number[])[0] : (values as number)
    paramsRef.current = { ...paramsRef.current, [key]: value }
    setDisplayValues((prev) => ({ ...prev, [key]: value }))
    sendParams(paramsRef.current)
  }

  const handleReset = () => {
    paramsRef.current = { ...DEFAULT_PARAMS }
    setDisplayValues({ ...DEFAULT_PARAMS })
    sendParams(paramsRef.current)
  }

  return (
    <>
      <div className="mx-auto flex h-full w-full max-w-full flex-1 items-stretch gap-6 overflow-hidden p-6">
        {/* Upload error */}

        {/* Left column — preview */}
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-md border bg-muted">
          <label className="flex h-full w-full flex-1 cursor-pointer items-center justify-center">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="invisible absolute"
              onChange={handleFileChange}
            />
            <div className={`h-full w-full overflow-auto ${hasPreview ? '' : 'hidden'}`}>
              <img ref={imgRef} className="h-full w-full object-contain object-center" alt="Preview" />
            </div>
            {!hasPreview && (
              <span
                aria-invalid={uploadError}
                className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground aria-invalid:text-destructive!"
              >
                <ImageUpIcon />
                Upload your image
              </span>
            )}
          </label>

          {/* Uploading overlay */}
          {(isUploading || typeof window === 'undefined') && (
            <div className="absolute inset-0 z-20 grid place-content-center bg-neutral-900/50 backdrop-blur-xs">
              <Spinner className="stroke-neutral-50" />
            </div>
          )}

          {/* Debug bar */}
          {sessionId && (
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 rounded-b-[inherit] bg-neutral-950/50 px-3 py-1 text-xs text-neutral-50 backdrop-blur-sm">
              <span
                className={`size-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
                aria-label={isConnected ? 'Connected' : 'Disconnected'}
              />
              <span>{fps} FPS</span>
            </div>
          )}
        </div>

        {/* Right column — controls */}
        <FieldSet className="h-full basis-1/3 overflow-hidden pr-2">
          <FieldLegend>Enhancement</FieldLegend>
          <FieldDescription>
            Adjust the enhancement level to improve the overall quality of your image.
          </FieldDescription>
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
                      onValueChange={(values) => handleSliderChange(key, values)}
                    />
                  </Field>
                </HoverCardTrigger>
                <HoverCardContent side="left" align="start">
                  {description}
                </HoverCardContent>
              </HoverCard>
            ))}

            {/* JPEG Quality */}
            <Field>
              <FieldLabel className="flex justify-between">
                JPEG Quality
                <Badge variant="outline" render={<small>{displayValues.jpeg_quality}</small>} />
              </FieldLabel>

              <Slider
                key={`jpeg_quality-${sessionId}`}
                defaultValue={[DEFAULT_PARAMS.jpeg_quality]}
                value={[displayValues.jpeg_quality]}
                min={1}
                max={100}
                step={1}
                onValueChange={(values) => handleSliderChange('jpeg_quality', values)}
              />
              <p className="text-xs text-muted-foreground">
                Controls the output JPEG compression quality. Higher values preserve more detail but increase file size.
              </p>
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field orientation="horizontal" className="justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button type="button" onClick={handleReset}>
                Save
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </>
  )
}

export default PlaygroundForm
