import PlaygroundForm from '@/components/blocks/playground/playground-form'
import { ErrorBoundaryFallback } from '@/components/exceptions/error-boundary-fallback'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_playground-layout/')({
  component: PlaygroundForm,
  errorComponent: ErrorBoundaryFallback,
  head: () => ({
    meta: [
      { title: 'Playground' },
      {
        name: 'description',
        content: `Welcome to the Image Processing Playground! Here, you can unleash your creativity and experiment with a wide range of image processing techniques. Whether you're a beginner looking to learn the basics or an experienced developer seeking to push the boundaries of what's possible, our playground offers a fun and interactive environment to explore the endless possibilities of image manipulation. Dive in and start creating stunning visuals today!`,
      },
    ],
  }),
})
