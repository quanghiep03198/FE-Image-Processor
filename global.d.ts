/// <reference types="vite/client" />

import { type IncomingHttpHeaders } from 'http'
import type { HttpStatusCode } from '../constants/http-code'

export declare global {
  type RuntimeEnvironment = 'production' | 'development' | 'test'

  interface ImportMeta {
  readonly env: InternalImportMetaEnv
}

  interface InternalImportMetaEnv {
    // * Application
    readonly NODE_ENV: RuntimeEnvironment
    readonly VITE_API_URL: `${'http' | 'https'}://${string}`
    readonly VITE_WS_URL: `${'ws' | 'wss'}://${string}`
  }

  type Parameter<T> = T extends (param: infer Argument, ...rest: any) => any ? Argument : never

  interface Pagination<T = any> {
    hasNextPage: boolean
    hasPrevPage: boolean
    nextPage: number | null
    prevPage: number | null
    totalPages: number
    totalDocs: number
    limit: number
    page: number
    data: T[]
  }

  interface ResponseBody<T> {
    message: string
    statusCode: HttpStatusCode
    metadata: T | null
    path: string
    stack?: string
    timestamp: Date
  }

  type Nullable<T> = T | null | undefined

  type AnonymousFunction = (...args: any[]) => any

  type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS'

  interface RequestQuery {
    [key: RequestQueryKey | string]: string | number | boolean

  }

  type RequestHeaders = {
    // copy every declared property from http.IncomingHttpHeaders
    // but remove index signatures
    [K in keyof IncomingHttpHeaders as string extends K ? never : number extends K ? never : K]: IncomingHttpHeaders[K]
    [`x-${string}`]: string | undefined | undefined;
  }

  /**
   * @override
   * @param input 
   * @param init 
   */
  function fetch(
    input: RequestInfo | URL,
    init?: Omit<RequestInit, 'headers'> & { headers: RequestHeaders }
  ): Promise<Response>
}