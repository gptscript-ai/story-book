// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    storiesVolumePath: 'public/stories', // NUXT_STORIES_VOLUME_PATH
    openaiAPIKey: '' // NUXT_OPENAI_API_KEY
  },
})
