import { matchQuery, MutationCache, QueryClient, type QueryKey } from '@tanstack/react-query'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: Error
    mutationMeta: {
      invalidates?: Array<QueryKey>
    }
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 60 * 24, // 24h - must be >= maxAge for persister to work
      // experimental_prefetchInRender: true,
      networkMode: 'always',
    },
    mutations: {
      networkMode: 'always',
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          // invalidate all matching tags at once
          // or everything if no meta is provided
          mutation.meta?.invalidates?.some((queryKey) => matchQuery({ queryKey }, query)) ?? true,
      })
    },
  }),
})
