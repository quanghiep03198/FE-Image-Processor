import { getImagesQueryOptions } from '@/apis/images/hooks'
import Gallery from '@/components/blocks/playground/gallery'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_playground-layout/my-images')({
  head: () => ({
    meta: [
      { title: 'My Images' },
      {
        name: 'description',
        content: `Explore your personal gallery of uploaded images! Here, you can view, manage, and organize all the images you've uploaded to the Image Processing Playground. Whether you're looking to apply new filters, share your creations with friends, or simply admire your collection, this is the place to be. Dive into your gallery and let your creativity shine!`,
      },
    ],
  }),
  component: Gallery,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getImagesQueryOptions())
  },
  validateSearch: z.object({
    view: z.enum(['grid', 'list']).default('list'),
    mime_type: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
  }),
})
