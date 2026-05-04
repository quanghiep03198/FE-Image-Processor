import type { IUser } from '@/apis/auth/types'
import { axiosRequestWithAuth } from '@/lib/axios'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export const authMiddleware = createMiddleware({ type: 'request' }).server(async ({ next }) => {
  const accessToken = getCookie('access_token')
  if (!accessToken) throw redirect({ to: '/login' })

  const user = await axiosRequestWithAuth<IUser>({ url: '/auth/profile', method: 'GET' })
  if (!user) throw redirect({ to: '/login' })

  return next({ context: { user, accessToken } })
})
