export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  // Optimizaciones de Performance
  nitro: {
    compressPublicAssets: true,
  },
  ui: {
    icons: ['lucide']
  },
  // Corregir el bloqueo de fuentes que sale en tu reporte
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
      ]
    }
  },
  // Evita que Nuxt cargue todo el JS al inicio
  experimental: {
    payloadExtraction: false
  }
})