import { requestMiddleware } from '@/middlewares/request.middleware'
import { createServerFn } from '@tanstack/react-start'
import { loginSchema } from '../schemas/login.schema'

export const loginRPC = createServerFn({ method: 'POST' })
  .middleware([requestMiddleware])
  .inputValidator(loginSchema)
  .handler(async ({ context, data }) => {
    return await context.request({ url: '/auth/login', data })
  })
