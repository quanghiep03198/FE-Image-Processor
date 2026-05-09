import { stringify } from 'qs'

type TAvatarGenOptions = {
  name: string
  background?: string
  color?: string
  length?: number
  bold?: boolean
  format?: 'svg' | 'png'
}

export default function generateAvatar({
  background = '#525252',
  color = '#fafafa',
  length = 1,
  bold = true,
  format = 'svg',
  name,
}: TAvatarGenOptions) {
  const BASE_AVATAR_URL = 'https://api.dicebear.com/9.x/glass/svg'
  return (
    BASE_AVATAR_URL +
    stringify(
      {
        background,
        color,
        length,
        bold,
        format,
        seed: name,
      },
      { addQueryPrefix: true },
    )
  )
}
