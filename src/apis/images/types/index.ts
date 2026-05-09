import type { IUser } from '@/apis/auth/types'

export interface IImage extends IBaseDocument {
  name: string
  mime_type: ImageMimeType
  size: number
  url: string
  owner: Omit<IUser, 'password'>
}
