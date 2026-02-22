// nuxt.config.ts
export default defineNuxtConfig({
  // Configuración de variables de entorno y API
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Sistema de Facturación - Pro',
      meta: [
        { charset: 'utf-16' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Generador de facturas profesional optimizado para rendimiento.' }
      ],
    }
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  // Nuxt UI / Tailwind: Desactivamos el viewer para ahorrar memoria en producción
  ui: {
    icons: ['lucide']
  },

  tailwindcss: {
    viewer: false,
  },

  // Optimización de fuentes: Usamos 'swap' para evitar que el texto desaparezca mientras carga (FOIT)
  // Eliminamos preconnects manuales ya que Nuxt UI gestiona las fuentes de forma más eficiente aquí
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 700], display: 'swap' }
    ]
  },

  // Configuración de Nitro: Compresión y reglas de caché para Railway
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true
    },
    // Cache agresiva para archivos estáticos generados por Nuxt
    routeRules: {
      '/_nuxt/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=31536000, immutable' 
        } 
      }
    }
  },

  // Vite: Configuración crítica para bajar el TBT (Total Blocking Time)
  vite: {
    build: {
      cssCodeSplit: true, // Divide el CSS para que solo cargues lo que usas
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Dividimos las librerías grandes en trozos pequeños (chunks)
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('vue') || id.includes('pinia')) return 'vendor-core';
              if (id.includes('lucide') || id.includes('@headlessui')) return 'vendor-ui';
              return 'vendor-libs';
            }
          }
        }
      }
    }
  },

  // Renderizado: Prerrenderizamos la home para que el FCP sea casi instantáneo
  routeRules: {
    '/': { prerender: true }
  },

  css: ['~/assets/css/main.css'],

  devtools: { enabled: false },

  compatibilityDate: '2025-01-15'
})