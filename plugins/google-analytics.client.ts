import GTag, { trackRouter } from 'vue-gtag-next'

export default defineNuxtPlugin(({ vueApp }) => {
  const id = useRuntimeConfig().public.googleAnalytics

  if (id) {
    console.debug(`Activating Google Analytics (${ id })`)
    vueApp.use(GTag, { property: { id } })

    trackRouter(useRouter())
  }
})
