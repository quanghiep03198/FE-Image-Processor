import SignInForm from '@/components/blocks/auth/signin-form'
import { guestMiddleware } from '@/middlewares/auth.middleware'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-layout/signin')({
  component: SignInForm,
  server: {
    middleware: [guestMiddleware],
  },
  head: () => ({
    meta: [
      { title: 'Sign In' },
      {
        name: 'description',
        content: `Welcome back! Please sign in to your account to access your personalized image processing playground, manage your images, and explore the exciting features we have in store for you.`,
      },
    ],
  }),
})
