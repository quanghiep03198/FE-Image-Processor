import Plasma from '@/components/plasma'
import Logo from '@/components/shared/logo'
import { Typography } from '@/components/ui/typography'
import { guestMiddleware } from '@/middlewares/auth.middleware'
import { useTheme } from '@/providers/theme-provider'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-layout')({
  component: RouteComponent,
  server: {
    middleware: [guestMiddleware],
  },
})

function RouteComponent() {
  const { userTheme } = useTheme()
  return (
    <div className="h-screen w-screen overflow-hidden bg-muted p-2 md:max-xl:p-4 xl:p-6">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-1 overflow-clip rounded-lg border bg-background lg:grid-cols-2">
        <div className="relative hidden flex-col justify-end p-6 lg:flex">
          <Typography variant="blockquote">
            Simplify your image processing workflow with our intuitive web app, powered by <strong>NVIDIA</strong>'s
            cutting-edge technology and <strong>OpenCV</strong>'s robust capabilities. Experience seamless performance
            and stunning results, all in one place.
          </Typography>
          <div className="absolute inset-0 z-0">
            <Plasma
              opacity={0.5}
              color={userTheme === 'light' ? '#212121' : '#fafafa'}
              scale={1.25}
              mouseInteractive={true}
              direction="reverse"
            />
          </div>
        </div>
        <div className="scrollbar-none flex flex-col items-center justify-between overflow-auto p-6">
          <div className="xxl:pt-20 px-6 pt-6 pb-6">
            <Logo className="text-3xl" />
          </div>
          <div className="w-full px-6">
            <Outlet />
          </div>
          <div className="flex flex-col items-center gap-6 p-6">
            <div className="w-fulltext-center text-sm text-muted-foreground">
              Powered by <span className="inline-flex text-foreground">NVIDIA &#215; OpenCV</span>
            </div>
            <Typography color="muted" variant="small" className="text-center">
              &copy; {new Date().getFullYear()} copyright by{' '}
              <a href="https://github.com/quanghiep03198" target="_blank" className="text-primary hover:underline">
                quanghiep03198
              </a>
              . All rights reserved.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}
