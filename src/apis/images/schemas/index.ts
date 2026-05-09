import { z } from 'zod'

export const updateImageSchema = z.object({
  id: z.string(),
  name: z.string({ message: 'Enter a valid name' }),
  // .regex(/^[a-zA-Z0-9-_ ]+$/, 'Name can only contain letters, numbers, spaces, hyphens, and underscores'),
})

export type TUpdateImageValues = z.infer<typeof updateImageSchema>
