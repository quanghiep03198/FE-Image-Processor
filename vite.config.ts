import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

const config = defineConfig({
  resolve: {
    // This enables built-in support for path aliases defined in tsconfig.json
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    // viteTsConfigPaths({
    //   projects: ['./tsconfig.json'],
    // }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  server: {
    port: 3198,
  },
  preview: {
    port: 1205,
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: '@tanstack/react-query', test: /@tanstack\/react-query/ },
            { name: '@tanstack/react-router', test: /@tanstack\/react-router/ },
            { name: '@tanstack/react-table', test: /@tanstack\/react-table/ },
            { name: '@tanstack/react-virtual', test: /@tanstack\/react-virtual/ },
            { name: '@tanstack/react-form', test: /@tanstack\/react-form/ },
            { name: 'react-resizable-panels', test: /react-resizable-panels/ },
            { name: 'recharts', test: /recharts/ },
            { name: 'qs', test: /qs/ },
            { name: 'lz-string', test: /lz-string/ },
            { name: 'lodash-es', test: /lodash-es/ },
            { name: 'sonner', test: /sonner/ },
            { name: 'zod', test: /zod/ },
          ],
        },
      },
    },
  },
})

export default config
