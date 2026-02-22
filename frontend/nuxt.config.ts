// https://nuxt.com/docs/api/configuration/nuxt-config

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
        { name: 'description', content: 'Generador de facturas profesional y rápido' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
      ]
    }
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

 
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true
    },
    
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },

  vite: {
    build: {
      cssCodeSplit: true, 
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        }
      }
    }
  },

  
  ui: {
   
    icons: ['lucide']
  },

  tailwindcss: {
    exposeConfig: true,
    viewer: false, 
  },

  
  devtools: {
    enabled: false 
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})