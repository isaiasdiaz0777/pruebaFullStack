export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Sistema de Facturación - Prueba',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      // ELIMINAMOS los preconnects de Google Fonts porque el reporte dice que no se usan
    }
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  // MEJORA: Configuración de fuentes nativa de Nuxt UI
  // Esto evita que las fuentes bloqueen el LCP
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 700], display: 'swap' }
    ]
  },

  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true
    },
    // Cache agresiva para Railway
    routeRules: {
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }
    }
  },

  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('vue') || id.includes('pinia')) return 'vendor-core';
              if (id.includes('lucide') || id.includes('headlessui')) return 'vendor-ui';
              return 'vendor-others';
            }
          }
        }
      }
    }
  },

  // Reducimos el peso de Tailwind
  tailwindcss: {
    viewer: false,
  },

  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15'
})