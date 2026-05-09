import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ArrowLeftIcon, TrafficConeIcon } from 'lucide-react'

export const Route = createFileRoute('/_auth-layout/forgot-password')({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: 'Forgot Password' },
      {
        name: 'description',
        content: `Forgot your password? No worries! Just enter your email address, and we'll send you instructions to reset your password and regain access to your account.`,
      },
    ],
  }),
})

function RouteComponent() {
  const router = useRouter()

  return (
    <Empty className="p-0">
      <EmptyMedia variant="icon">
        <TrafficConeIcon size={32} strokeWidth={1.5} />
      </EmptyMedia>
      <EmptyHeader className="max-w-lg">
        <EmptyTitle>503 - Service Unavailable</EmptyTitle>
        <EmptyDescription>
          This feature is under developement. Please check back later. We are working hard to bring it to you as soon as
          possible.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button onClick={() => router.history.back()}>
          <ArrowLeftIcon /> Go back
        </Button>
      </EmptyContent>
    </Empty>
  )
}
