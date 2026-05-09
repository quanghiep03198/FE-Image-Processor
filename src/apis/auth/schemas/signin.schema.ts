import { z } from 'zod'
import { emailSchema } from './email.schema'

export const signInSchema = z.object({
  ...emailSchema.shape,
  password: z.string({ message: 'Please provide your password' }).min(6),
})

export type TSignInValues = z.infer<typeof signInSchema>
