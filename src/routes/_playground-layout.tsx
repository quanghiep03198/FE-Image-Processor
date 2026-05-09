import { getProfileQueryOptions } from '@/apis/auth/hooks'
import PlaygroundHeader from '@/components/blocks/playground/playground-header'
import { Spinner } from '@/components/ui/spinner'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_playground-layout')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    await context.queryClient.prefetchQuery(getProfileQueryOptions())
  },
  pendingComponent: () => (
    <div className="fixed top-2 left-1/2 z-50 -translate-x-1/2">
      <Spinner />
    </div>
  ),
})

function RouteComponent() {
  return (
    <div className="flex h-screen w-screen flex-col divide-y overflow-hidden">
      <PlaygroundHeader />
      <div className="@container-[size] h-full flex-1 p-(--outlet-padding) [--outlet-padding:24px]">
        <Outlet />
      </div>
    </div>
  )
}
