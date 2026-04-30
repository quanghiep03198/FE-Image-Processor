import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import viteTsConfigPaths from 'vite-tsconfig-paths'

const config = defineConfig({
  plugins: [
    devtools(),
    nitro(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: false,
      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/sw\.js$/, /^\/workbox-.*\.js$/, /\.(wasm|map)$/],
        globPatterns: ['**/*.{html,css,js,ico,png,jpg,svg,webp,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 3 MiB
        skipWaiting: true,
        clientsClaim: true,
        navigationPreload: true,
        // runtimeCaching: [
        //   {
        //     // Hashed assets under /assets/ are already precached, but this ensures
        //     // any dynamically loaded chunks are also cached with CacheFirst
        //     urlPattern: ({ url }) => url.pathname.startsWith('/assets/'),
        //     handler: 'CacheFirst',
        //     options: {
        //       cacheName: 'assets-cache',
        //       expiration: {
        //         maxEntries: 500,
        //         maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year (hashed filenames)
        //         purgeOnQuotaError: true,
        //       },
        //       cacheableResponse: {
        //         statuses: [0, 200],
        //       },
        //     },
        //   },
        //   {
        //     // Static resources in root (favicon, icons, images) - not hashed, use StaleWhileRevalidate
        //     urlPattern: /\.(?:ico|png|jpg|jpeg|svg|webp|woff2?)$/i,
        //     handler: 'StaleWhileRevalidate',
        //     options: {
        //       cacheName: 'static-resources-cache',
        //       expiration: {
        //         maxEntries: 500,
        //         maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        //         purgeOnQuotaError: true,
        //       },
        //       cacheableResponse: {
        //         statuses: [0, 200],
        //       },
        //     },
        //   },
        //   {
        //     // API calls - never cache
        //     urlPattern: ({ url }) => url.pathname.startsWith('/api'),
        //     handler: 'NetworkOnly',
        //   },
        // ],
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
        type: 'module',
        suppressWarnings: true,
        navigateFallback: '/index.html',
      },
    }),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  server: {
    port: 3198,
  },
})

export default config
