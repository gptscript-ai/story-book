// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    scriptPath: 'story-book.gpt', // NUXT_SCRIPT_PATH
    storiesVolumePath: 'stories', // NUXT_STORIES_VOLUME_PATH
  },
})
