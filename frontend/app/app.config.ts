export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  }
})
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      // Esta variable la cambiaremos en el panel de Railway después
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
    }
  },
  modules: ['@nuxt/ui'] // O los que estés usando
})