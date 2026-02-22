// nuxt.config.ts
export default defineNuxtConfig({

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Sistema de Facturación Profesional',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Generador de facturas rápido y optimizado.' }
      ],
    }
  },


  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/eslint'
  ],

  
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
    }
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 700], display: 'swap' }
    ]
  },


  ui: {
    icons: ['lucide'],
 
    safelistColors: ['primary', 'red', 'orange', 'green', 'blue', 'pink', 'purple']
  },


  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true
    },
    routeRules: {
 
      '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } }
    }
  },

  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
             
              if (id.includes('vue') || id.includes('pinia')) return 'vendor-core';
              if (id.includes('@headlessui') || id.includes('lucide')) return 'vendor-ui';
              return 'vendor-others';
            }
          }
        }
      }
    }
  },


  tailwindcss: {
    viewer: false 
  },

  devtools: { enabled: false },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15'
})