import { imageFiltersSchema } from './image-filters.schema'

import { z } from 'zod'

export const uploadSchema = imageFiltersSchema.omit({ preview: true }).extend({
  file: z.any().refine((value) => !!value && (value instanceof File || value instanceof Blob)),
})

export type TUploadValues = z.infer<typeof uploadSchema>
