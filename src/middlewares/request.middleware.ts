import type { IUser } from '@/apis/auth/types'
import type { RequestConfig } from '@/configs/axios.config'
import { request } from '@/lib/request'

import { createMiddleware } from '@tanstack/react-start'

export const requestMiddleware = createMiddleware({ type: 'request' }).server(async ({ context, next }) => {
  const contextWithAuth = context as { user: IUser; accessToken: string } | undefined

  return await next({
    context: {
      ...contextWithAuth,
      request: async <R = any, D = any>({ method = 'GET', ...config }: RequestConfig<D>) => {
        config.headers ??= {}

        return await request<R, D>({
          ...config,
          method,
          headers: {
            ...config.headers,
            ...(!!contextWithAuth?.accessToken && {
              authorization: `Bearer ${contextWithAuth.accessToken}`,
            }),
          },
        })
      },
    },
  })
})
