import { stringify } from 'qs'
import type { Options } from 'redaxios'
import axios from 'redaxios'
import env from '../lib/utils'

export type RequestConfig<D> = Omit<Options, 'headers' | 'data'> & {
  headers?: RequestHeaders
  data?: D
}

export const axiosInstance = axios.create({
  baseURL: env('VITE_API_URL'),
  paramsSerializer: (params) =>
    stringify(params, {
      addQueryPrefix: true,
      skipNulls: false,
      format: 'RFC1738', // use RFC1738 to encode spaces as '+'
    }),
})
