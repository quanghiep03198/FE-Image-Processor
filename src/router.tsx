import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { ErrorBoundaryFallback } from './components/exceptions/error-boundary-fallback'
import { NotFoundPage } from './components/exceptions/not-found'
import { queryClient } from './integrations/react-query'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ErrorBoundaryFallback,
    defaultNotFoundComponent: NotFoundPage,
    Wrap: ({ children }: React.PropsWithChildren) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    },
  })
  setupRouterSsrQueryIntegration({ router, queryClient })
  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
