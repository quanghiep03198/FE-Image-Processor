import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { deleteImageRPC, getSavedImagesRPC, saveImageRPC, updateImageRPC } from '../rpc'
import type { TUpdateImageValues } from '../schemas'

export const GET_IMAGES_QUERY_KEY = 'images'

export const getImagesQueryOptions = () => {
  return queryOptions({
    queryKey: [GET_IMAGES_QUERY_KEY],
    queryFn: () => getSavedImagesRPC(),
    staleTime: 5000,
  })
}

export const useGetImagesQueryKey = () => {
  return useSuspenseQuery(getImagesQueryOptions())
}

export const useSaveImageMutation = () => {
  const saveImage = useServerFn(saveImageRPC)

  return useMutation({
    meta: { invalidates: [[GET_IMAGES_QUERY_KEY]] },
    mutationFn: (sessionId: string) => saveImage({ data: sessionId }),
  })
}

export const useUpdateImageMutation = () => {
  const updateImage = useServerFn(updateImageRPC)

  return useMutation({
    meta: { invalidates: [[GET_IMAGES_QUERY_KEY]] },
    mutationFn: ({ id, name }: TUpdateImageValues) => updateImage({ data: { id, name } }),
  })
}

export const useDeleteImageMutation = () => {
  const deleteImage = useServerFn(deleteImageRPC)

  return useMutation({
    meta: { invalidates: [[GET_IMAGES_QUERY_KEY]] },
    mutationFn: (imageId: string) => deleteImage({ data: imageId }),
  })
}
