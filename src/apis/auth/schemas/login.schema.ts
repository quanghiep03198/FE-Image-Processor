import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string({ message: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z.string({ message: 'Please provide your password' }).min(6),
})

export type TLoginValues = z.infer<typeof loginSchema>
