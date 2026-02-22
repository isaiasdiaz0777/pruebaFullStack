export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@pinia/nuxt'],

  // Configuración de fuentes nativa para que no bloqueen el render
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 700], display: 'swap' }
    ]
  },

  // Evita que el JS de Tailwind sea pesado
  tailwindcss: {
    viewer: false
  },

  // Nitro para que Railway vuele
  nitro: {
    compressPublicAssets: true
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Sistema de Facturación'
    }
  },

  devtools: { enabled: false },
  compatibilityDate: '2025-01-15'
})