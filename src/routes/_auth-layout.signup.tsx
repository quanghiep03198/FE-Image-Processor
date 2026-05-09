import SignUpForm from '@/components/blocks/auth/signup-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-layout/signup')({
  component: SignUpForm,
  head: () => ({
    meta: [
      { title: 'Sign Up' },
      {
        name: 'description',
        content: `Join our image processing playground today! Sign up to create your personalized account, where you can upload and manage your images, experiment with various filters and transformations, and share your creations with the community. Don't miss out on the fun – sign up now and start exploring the endless possibilities of image processing!`,
      },
    ],
  }),
})
