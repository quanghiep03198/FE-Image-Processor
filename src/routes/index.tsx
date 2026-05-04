import PlaygroundForm from '@/components/widgets/playground/playground-form'
import PlaygroundHeader from '@/components/widgets/playground/playground-header'
import { ThemeProvider } from '@/providers/theme-provider'
import { imageFiltersSchema } from '@/schemas/image-filters.schema'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
  ssr: true,
  validateSearch: imageFiltersSchema,
})

function App() {
  return (
    <ThemeProvider>
      <div className="flex h-screen w-screen flex-col divide-y overflow-hidden">
        <PlaygroundHeader />

        <PlaygroundForm />
      </div>
    </ThemeProvider>
  )
}
