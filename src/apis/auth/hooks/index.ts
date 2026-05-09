import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import { getProfileRPC, signOutRPC } from '../rpc'

export const GET_PROFILE_QUERY_OPTIONS = 'profile'

export const getProfileQueryOptions = () => {
  return queryOptions({
    queryKey: [GET_PROFILE_QUERY_OPTIONS],
    staleTime: 0,
    queryFn: () => getProfileRPC(),
  })
}

export const useGetProfileQuery = () => {
  return useQuery(getProfileQueryOptions())
}

export const useSignOutMutation = () => {
  const router = useRouter()
  const signOut = useServerFn(signOutRPC)

  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      toast.success('Signed out successfully')
      router.invalidate().finally(() => router.navigate({ to: '/signin' }))
    },
  })
}
