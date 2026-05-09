import env from '@/lib/utils'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { createFileRoute } from '@tanstack/react-router'

const sanitizeFilename = (filename: string) => filename.replace(/[\\/:*?"<>|]/g, '_')

export const Route = createFileRoute('/api/images/download')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      GET: async ({ context, request }) => {
        const accessToken = context.accessToken
        if (!accessToken) return new Response('Unauthorized', { status: 401 })

        const requestUrl = new URL(request.url)
        const imageDest = requestUrl.searchParams.get('imgDest')
        const imageName = requestUrl.searchParams.get('name') ?? 'image'

        if (!imageDest) return new Response('imgDest is required', { status: 400 })

        const normalizedImagePath = imageDest.replaceAll('\\', '/').replace(/^\/?images\//, '/images/download/')

        const upstreamUrl = new URL(normalizedImagePath, env('VITE_API_URL')).toString()
        const upstreamResponse = await fetch(upstreamUrl, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        })

        if (!upstreamResponse.ok || !upstreamResponse.body) {
          return new Response('Failed to download image', { status: upstreamResponse.status || 502 })
        }

        const contentType = upstreamResponse.headers.get('content-type') ?? 'application/octet-stream'
        const contentDisposition =
          upstreamResponse.headers.get('content-disposition') ?? `attachment; filename="${sanitizeFilename(imageName)}"`

        return new Response(upstreamResponse.body, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': contentDisposition,
            'Cache-Control': 'no-store',
          },
        })
      },
    },
  },
})
