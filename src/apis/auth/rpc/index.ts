import { DEFAULT_COOKIE_OPTIONS } from '@/configs/cookie.config'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { requestMiddleware } from '@/middlewares/request.middleware'
import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { emailSchema } from '../schemas/email.schema'
import { signInSchema, type TSignInValues } from '../schemas/signin.schema'
import { signUpSchema, type TSignUpValues } from '../schemas/signup.schema'
import type { IUser } from '../types'

export const signInRPC = createServerFn({ method: 'POST' })
  .middleware([requestMiddleware])
  .inputValidator(signInSchema)
  .handler(async ({ context, data }) => {
    const response = await context.request<{ access_token: string; user: IUser }, TSignInValues>({
      url: '/auth/signin',
      method: 'POST',
      data,
    })
    if (response) setCookie('access_token', response.access_token, DEFAULT_COOKIE_OPTIONS)
    return response
  })

export const signUpRPC = createServerFn({ method: 'POST' })
  .middleware([requestMiddleware])
  .inputValidator(signUpSchema)
  .handler(async ({ context, data }) => {
    return await context.request<IUser, TSignUpValues>({ url: '/auth/signup', method: 'POST', data })
  })

export const signOutRPC = createServerFn({ method: 'POST' })
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context }) => {
    setCookie('access_token', '', { ...DEFAULT_COOKIE_OPTIONS, maxAge: 0 })
    return await context.request({ url: '/auth/signout', method: 'POST' })
  })

export const getProfileRPC = createServerFn({ method: 'GET' })
  .middleware([requestMiddleware])
  .handler(async ({ context }) => {
    const accessToken = getCookie('access_token')
    if (!accessToken) return null
    return await context.request<IUser>({ url: '/auth/profile', method: 'GET' })
  })

export const sendResetPasswordOTP = createServerFn({ method: 'POST' })
  .middleware([requestMiddleware])
  .inputValidator(emailSchema)
  .handler(async ({ data }) => {
    console.debug(data)
    // Send reset password to user email
  })
