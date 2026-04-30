import { clsx, type ClassValue } from 'clsx'
import { isNil } from 'lodash-es'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function env<T = string>(key: keyof InternalImportMetaEnv, defaultValue?: T) {
  const value = import.meta.env[key]
  if (!isNil(value)) return value as T
  return defaultValue
}

export const createFormData = (data: Record<string, any>) => {
  const formData = new FormData()
  for (const key in data) {
    const value = data[key]
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value)
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, String(value))
    }
  }
  return formData
}
