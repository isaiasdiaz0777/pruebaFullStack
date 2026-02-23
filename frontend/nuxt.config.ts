// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  // 1. Configuración de variables de entorno
  runtimeConfig: {
    public: {
      // En Railway configuraremos NUXT_PUBLIC_API_BASE
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://pruebafullstack-production.up.railway.app/api'
    }
  },

  // 2. Configuración Global del Head (SEO y PWA)
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Sistema de Facturación Proactiva',
      meta: [
        // Esta línea es la que te subirá el SEO de 90 a 100
        { name: 'description', content: 'Generador de facturas profesional optimizado para rapidez, accesibilidad y eficiencia.' },
        { name: 'theme-color', content: '#1f1f1f' }
      ],
      link: [
        // Enlace explícito al manifiesto para asegurar detección en Lighthouse
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
      ]
    }
  },

  // 3. Módulos
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],

  // 4. Configuración detallada de la PWA (Puntos Extra)
  pwa: {
    registerType: 'autoUpdate',
    injectRegister: 'auto', // Registra el Service Worker automáticamente en el cliente
    manifest: {
      name: 'Sistema de Facturación Proactiva',
      short_name: 'FacturaPro',
      description: 'Generador de facturas profesional optimizado',
      theme_color: '#1f1f1f',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable' // Puntos extra en Lighthouse por iconos adaptativos
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      // Cacheamos assets estáticos para mejorar el FCP y LCP
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}']
    },
    client: {
      installPrompt: true, // Habilita la invitación a instalar como app
      periodicSyncForUpdates: 3600 // Revisa actualizaciones cada hora
    },
    devOptions: {
      enabled: true, // Permite debuguear la PWA en localhost:3000
      type: 'module'
    }
  },

  // 5. Estilos y UI
  css: ['~/assets/css/main.css'],
  
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

  // 6. Optimizaciones de Renderizado
  routeRules: {
    // Prerenderizado de la home para mejorar la velocidad inicial (Performance)
    '/': { prerender: true }
  },
 
  nitro: {
    compressPublicAssets: true, // Esto activa Gzip/Brotli para tus assets, ¡adiós al error de compresión!
  },

  // 7. Herramientas de Desarrollo y Calidad
  devtools: {
    enabled: true
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