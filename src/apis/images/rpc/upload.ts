import { axiosInstance } from '@/configs/axios.config'
import { createFormData } from '@/lib/utils'

export type UploadResponse = {
  session_id: string
  preview: string
}

export async function uploadImage(file: File, oldSessionId: string | null): Promise<Nullable<UploadResponse>> {
  const formData = createFormData({ file, ...(oldSessionId && { old_session_id: oldSessionId }) })
  const response = await axiosInstance.post<UploadResponse>('/images/upload', formData)
  return response.data
}
