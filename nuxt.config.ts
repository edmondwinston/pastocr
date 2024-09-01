// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    typeCheck: true,
  },

  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
  ],

  compatibilityDate: '2024-09-01'
})