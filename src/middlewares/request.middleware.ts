import type { IUser } from '@/apis/auth/types'
import { axiosRequestWithAuth, type RequestConfig } from '@/lib/axios'
import { createMiddleware } from '@tanstack/react-start'

export const requestMiddleware = createMiddleware({ type: 'request' }).server(async ({ context, next }) => {
  const contextWithAuth = context as { user: IUser; accessToken: string } | undefined

  return await next({
    ...contextWithAuth,
    request: async <R = any, D = any>(config: RequestConfig<D>) => {
      config.headers ??= {}

      const response: Awaited<R> = await axiosRequestWithAuth<R, D>({
        ...config,
        headers: {
          ...config.headers!,
          ...(!!contextWithAuth?.accessToken && {
            authorization: `Bearer ${contextWithAuth.accessToken}`,
          }),
        },
      })
      return response
    },
  })
})
