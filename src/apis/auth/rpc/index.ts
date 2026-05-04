import { axiosRequest } from '@/lib/axios'
import { createServerFn } from '@tanstack/react-start'
import { loginSchema } from '../schemas/login.schema'

export const loginRPC = createServerFn({ method: 'POST' })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    return await axiosRequest.post('/auth/login', data)
  })
