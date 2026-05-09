import { DEFAULT_COOKIE_OPTIONS } from '@/configs/cookie.config'
import { HttpStatusCode } from '@/constants/http-code'
import { redirect } from '@tanstack/react-router'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { type Options } from 'redaxios'
import { axiosInstance, type RequestConfig } from '../configs/axios.config'

export async function request<R = any, D = any>(config: RequestConfig<D>) {
  config.headers ??= {}

  const cookieToken = getCookie('access_token')

  if (cookieToken) config.headers.authorization ??= `Bearer ${cookieToken}`

  return await axiosInstance<R>(config as Options)
    .then((res) => res.data)
    .catch(async (error) => {
      if (error.status === HttpStatusCode.UNAUTHORIZED) {
        try {
          const res = await axiosInstance.get<{ access_token: string }>('/auth/refresh-token', {
            headers: { authorization: `Bearer ${cookieToken}` },
          })
          const refreshToken = res.data.access_token

          // Update the access token in cookies to ensure subsequent requests use the new token
          setCookie('access_token', refreshToken, DEFAULT_COOKIE_OPTIONS)

          if (res.status === HttpStatusCode.OK && (typeof refreshToken as string)) {
            const retryResponse = await axiosInstance<R>({
              ...config,
              headers: { ...config.headers, authorization: `Bearer ${refreshToken}` } as Options['headers'],
            })
            return retryResponse.data
          }
        } catch (error) {
          throw redirect({ to: '/signin' })
        }
      }
      console.error(error)
      return Promise.reject(error)
    })
}
