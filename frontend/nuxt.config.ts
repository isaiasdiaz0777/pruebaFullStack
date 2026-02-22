export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Sistema de Facturación Profesional',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // ESTO CORRIGE EL 90 EN SEO PARA LLEVARLO A 100:
        { name: 'description', content: 'Crea, gestiona y descarga facturas profesionales de forma rápida y segura con nuestro sistema optimizado.' }
      ]
    }
  },

  // Invertimos el orden para asegurar que Pinia cargue antes que la UI
  modules: [
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxt/eslint'
  ],

  // Optimizamos el renderizado de componentes pesados
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },

  vite: {
    build: {
      cssCodeSplit: true,
      // Reducimos el ruido visual en la consola que causa retardos
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // Agrupamos el núcleo para evitar el error de inicialización ($u)
              if (id.includes('vue') || id.includes('@vue') || id.includes('pinia')) return 'vendor-bundle';
              return 'vendor-ui';
            }
          }
        }
      }
    }
  },

  // Ajustes de UI para evitar el bloqueo del hilo principal
  ui: {
    global: true,
    icons: ['lucide'] 
  },

  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-01-15'
})