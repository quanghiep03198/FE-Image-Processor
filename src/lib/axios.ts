import { DEFAULT_COOKIE_OPTIONS } from '@/configs/cookie.config'
import { HttpStatusCode } from '@/constants/http-code'
import { redirect } from '@tanstack/react-router'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { stringify } from 'qs'
import axios, { type Options } from 'redaxios'
import env from './utils'

export type RequestConfig<D> = Omit<Options, 'headers' | 'data'> & {
  headers?: RequestHeaders
  data?: D
}

export const axiosRequest = axios.create({
  baseURL: env('VITE_API_URL'),
  paramsSerializer: (params) =>
    stringify(params, {
      addQueryPrefix: true,
      skipNulls: false,
      format: 'RFC1738', // use RFC1738 to encode spaces as '+'
    }),
})

export async function axiosRequestWithAuth<R = any, D = any>(config: RequestConfig<D>) {
  const accessToken = getCookie('access_token')

  const response = await axiosRequest<R>({
    ...config,
    headers: {
      ...(config.headers as Options['headers']),
      authorization: `Bearer ${accessToken}`,
    },
    ...(config.data && { data: config.data as D }),
  })

  if (response.status === HttpStatusCode.UNAUTHORIZED) {
    try {
      const res = await axiosRequest.get<{ access_token: string }>('/auth/refresh-token')
      const refreshToken = res.data.access_token

      // Update the access token in cookies to ensure subsequent requests use the new token
      setCookie('access_token', refreshToken, DEFAULT_COOKIE_OPTIONS)

      if (res.status === HttpStatusCode.OK && refreshToken) {
        return await axiosRequestWithAuth<R, D>({
          ...config,
          headers: {
            ...config.headers,
            authorization: `Bearer ${refreshToken}`,
          },
        })
      }
    } catch (error) {
      throw redirect({ to: '/login' })
    }
  }

  return response.data
}
