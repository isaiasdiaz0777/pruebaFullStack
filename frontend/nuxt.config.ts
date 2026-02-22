// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      // En Railway configuraremos NUXT_PUBLIC_API_BASE
      // Si no existe, usará localhost por defecto
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
    }
  },
  app: {
  head: {
    htmlAttrs: { lang: 'es' },
    title: 'Sistema de Facturación - Prueba' // Esto corrige el error de "Document doesn't have a <title>"
  }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    //'@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  // SOLUCIÓN AL ERROR: Forzamos a que use el nuevo motor de Tailwind
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  devtools: {
    enabled: true
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