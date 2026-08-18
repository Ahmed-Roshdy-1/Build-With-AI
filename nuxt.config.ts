export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    public: {
      appName: 'Stunning AI Builder'
    }
  },

  compatibilityDate: '2025-07-15'
})