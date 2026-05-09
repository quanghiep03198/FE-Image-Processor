import { z } from 'zod'
import { signInSchema } from './signin.schema'

export const signUpSchema = z.object({
  ...signInSchema.shape,
  display_name: z
    .string({ message: 'Enter your display name' })
    .min(3, { message: 'Your display name is too short, it should be at least 3 characters long' }),
})

export type TSignUpValues = z.infer<typeof signUpSchema>
