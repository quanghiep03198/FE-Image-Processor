import type { IUser } from '@/apis/auth/types'
import { request } from '@/lib/request'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export const guestMiddleware = createMiddleware().server(async ({ next }) => {
  if (getCookie('access_token')) throw redirect({ to: '/' })
  return await next()
})

export const authMiddleware = createMiddleware({ type: 'request' }).server(async ({ next }) => {
  const accessToken = getCookie('access_token')
  if (!accessToken) throw redirect({ to: '/signin' })

  const user = await request<IUser>({ url: '/auth/profile', method: 'GET' })
  if (!user) throw redirect({ to: '/signin' })

  return next({ context: { user, accessToken } })
})
