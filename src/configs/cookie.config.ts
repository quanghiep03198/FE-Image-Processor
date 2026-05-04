import type { setCookie } from '@tanstack/react-start/server'

export type CookieOptions = Parameters<typeof setCookie>[2]

export const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
}
