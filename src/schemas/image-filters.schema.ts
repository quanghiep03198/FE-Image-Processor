import { z } from 'zod'

export const imageFiltersSchema = z.object({
  brightness: z.number().nullish(),
  grayscale: z.number().nullish(),
  blur: z.number().nullish(),
  denoise: z.number().nullish(),
  sharpen: z.number().nullish(),
  enhance: z.number().nullish(),
  preview: z.string().nullish(),
})

export type TImageFilterValues = z.infer<typeof imageFiltersSchema>
