import { axiosRequest } from '@/lib/axios'
import { createFormData } from '@/lib/utils'

export type UploadResponse = {
  session_id: string
  preview: string
}

export async function uploadImage(file: File, oldSessionId: string | null): Promise<UploadResponse> {
  const formData = createFormData({ file, ...(oldSessionId && { old_session_id: oldSessionId }) })
  const response = await axiosRequest.post<UploadResponse>('/image/upload', formData)
  return response.data
}
