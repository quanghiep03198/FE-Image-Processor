import axios from '@/lib/axios'
import { createFormData } from '@/lib/utils'
import { uploadSchema } from '@/schemas/upload.schema'
import { useForm } from '@tanstack/react-form'
import { ImageUpIcon } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSeparator, FieldSet } from '../ui/field'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { Spinner } from '../ui/spinner'
import SliderFieldControl from './slider-field-control'

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = function () {
      resolve(reader.result as string)
    }
  })
}

const PlaygroundForm = () => {
  const id = useId()

  const imageRef = useRef<HTMLImageElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [preview, setPreview] = useState<string | null>(null)
  const form = useForm({
    defaultValues: {
      file: {} as File,
      blur: 0,
      denoise: 0,
      sharpen: 0,
      enhance: 0,
      brightness: 0,
      grayscale: 0,
    },
    onSubmitInvalid({ formApi }) {
      if (formApi.state.errors.some((error) => error.field === 'file'))
        toast.error('Please upload an image before submitting the form.')
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      try {
        const filteredValues = Object.entries(value).reduce(
          (acc, [key, val]) => {
            if (typeof val === 'number' || key === 'file') {
              acc[key] = val
            }
            return acc
          },
          {} as Record<string, any>,
        )
        const formData = createFormData(filteredValues)
        const response = await axios.post<Blob>('/process-image', formData, { responseType: 'blob' })
        setPreview(URL.createObjectURL(response.data))
      } finally {
        setIsLoading(false)
      }
    },
    validators: { onSubmit: uploadSchema as any },
  })

  const FieldItem = form.Field

  return (
    <form
      className="mx-auto flex h-full w-full max-w-full flex-1 items-stretch gap-6 overflow-hidden p-6"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      encType="multipart/form-data"
    >
      <FieldGroup className="relative basis-full overflow-clip rounded-md border transition-colors duration-200 has-[input[aria-invalid=true]]:border-destructive!">
        <FieldItem name="file">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !(field.state.value instanceof File)

            return (
              <label htmlFor={id} className="rounded-inherit flex h-full w-full flex-1 items-center justify-center">
                <input
                  type="file"
                  aria-invalid={isInvalid}
                  name="image"
                  id={id}
                  className="invisible absolute"
                  onChange={async (e) => {
                    const file = e.currentTarget.files?.[0]
                    if (file) setPreview(URL.createObjectURL(file))
                    field.handleChange(file as any)
                  }}
                />
                {preview ? (
                  <ScrollArea className="h-full">
                    <img ref={imageRef} src={preview} className="h-full w-full object-contain" />
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                ) : (
                  <span className="flex h-full flex-col items-center justify-center gap-2">
                    <ImageUpIcon />
                    Upload your image
                  </span>
                )}
              </label>
            )
          }}
        </FieldItem>
        <div
          aria-current={isLoading}
          className="absolute inset-0 z-20 hidden place-content-center bg-neutral-900/80 backdrop-blur-sm fade-in-0 aria-current:grid aria-current:animate-in"
        >
          <Spinner className="stroke-neutral-50" />
        </div>
      </FieldGroup>
      <FieldSet className="basis-1/3">
        <FieldLegend>Enhancement</FieldLegend>
        <FieldDescription>Adjust the enhancement level to improve the overall quality of your image.</FieldDescription>
        <FieldSeparator />
        <FieldGroup>
          <FieldItem name="brightness" listeners={{ onChange: () => form.handleSubmit(), onChangeDebounceMs: 100 }}>
            {(field) => (
              <SliderFieldControl
                field={field}
                label="Brightness"
                min={-1}
                max={1}
                step={0.01}
                description="Adjust the brightness level to make the image lighter or darker. Increasing brightness can help reveal details in dark areas, while decreasing it can reduce overexposure in bright areas."
              />
            )}
          </FieldItem>
          <FieldItem name="grayscale" listeners={{ onChange: () => form.handleSubmit(), onChangeDebounceMs: 100 }}>
            {(field) => (
              <SliderFieldControl
                field={field}
                label="Grayscale"
                step={0.01}
                min={0}
                max={1}
                description="Convert the image to grayscale by adjusting the intensity of the colors. A value of 0 will keep the original colors, while a value of 1 will convert the image to complete grayscale."
              />
            )}
          </FieldItem>
          <FieldItem name="denoise" listeners={{ onChange: () => form.handleSubmit(), onChangeDebounceMs: 100 }}>
            {(field) => (
              <SliderFieldControl
                field={field}
                label="Denoise"
                min={0}
                max={5}
                description="Reduce the amount of noise in the image, which can help improve the overall quality and clarity. Increasing the denoise level can help smooth out grainy or pixelated areas, but be careful not to overdo it, as it can also lead to a loss of detail."
              />
            )}
          </FieldItem>
          <FieldItem name="blur" listeners={{ onChange: () => form.handleSubmit(), onChangeDebounceMs: 100 }}>
            {(field) => (
              <SliderFieldControl
                field={field}
                label="Blur"
                min={0}
                max={5}
                description="It can be used to create a softening effect, reduce noise, or create a sense of motion in the image."
              />
            )}
          </FieldItem>
          <FieldItem name="sharpen" listeners={{ onChange: () => form.handleSubmit(), onChangeDebounceMs: 100 }}>
            {(field) => (
              <SliderFieldControl
                field={field}
                label="Sharpen"
                min={0}
                max={5}
                description="Enhance the edges and fine details in the image, making it appear clearer and more defined. Increasing the sharpen level can help bring out textures and details that may be lost due to blurriness or low resolution."
              />
            )}
          </FieldItem>
          <FieldItem name="enhance" listeners={{ onChange: () => form.handleSubmit(), onChangeDebounceMs: 100 }}>
            {(field) => (
              <SliderFieldControl
                field={field}
                label="Enhance"
                min={0}
                max={5}
                description="Improve the overall quality of the image by adjusting various parameters such as contrast, saturation, and color balance. Increasing the enhance level can help make the image more vibrant and visually appealing."
              />
            )}
          </FieldItem>
        </FieldGroup>

        <FieldGroup>
          <Field orientation="horizontal" className="justify-end gap-2">
            <Button
              type="reset"
              variant="outline"
              onClick={() => {
                form.reset({
                  file: form.state.values.file,
                  brightness: 0,
                  grayscale: 0,
                  blur: 0,
                  denoise: 0,
                  sharpen: 0,
                  enhance: 0,
                })
                form.handleSubmit()
                // navigate({ search: {preview: search.preview} })
              }}
            >
              Reset
            </Button>{' '}
            <Button type="submit">Apply</Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}

export default PlaygroundForm
