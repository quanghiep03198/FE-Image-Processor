import { createFormData } from '@/lib/utils'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { requestMiddleware } from '@/middlewares/request.middleware'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { updateImageSchema } from '../schemas'
import type { IImage } from '../types'

export const getSavedImagesRPC = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context }) => {
    return await context.request<IImage[]>({ url: '/images/saved' })
  })

export const saveImageRPC = createServerFn({ method: 'POST' })
  .middleware([authMiddleware, requestMiddleware])
  .inputValidator(z.string())
  .handler(async ({ context, data: sessionId }) => {
    return await context.request({ url: `/images/save/${sessionId}`, method: 'POST' })
  })

export const uploadImageRPC = createServerFn({ method: 'POST' })
  .middleware([requestMiddleware])
  .inputValidator(z.object({ file: z.instanceof(File), oldSessionId: z.string().nullable() }))
  .handler(async ({ context, data: { file, oldSessionId } }) => {
    const formData = createFormData({ file, ...(oldSessionId && { old_session_id: oldSessionId }) })
    const response = await context.request<{ session_id: string; preview: string }>({
      url: '/images/upload',
      method: 'POST',
      data: formData,
    })

    return response
  })

export const updateImageRPC = createServerFn({ method: 'POST' })
  .middleware([authMiddleware, requestMiddleware])
  .inputValidator(updateImageSchema)
  .handler(async ({ context, data: { id, name } }) => {
    return await context.request({ url: `/images/rename/${id}`, method: 'PATCH', data: { name } })
  })

export const deleteImageRPC = createServerFn({ method: 'POST' })
  .middleware([authMiddleware, requestMiddleware])
  .inputValidator(z.string())
  .handler(async ({ context, data: imageId }) => {
    return await context.request({ url: `/images/${imageId}`, method: 'DELETE' })
  })
