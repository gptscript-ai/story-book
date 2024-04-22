import type { Gtag } from 'vue-gtag-next'
import { useGtag } from 'vue-gtag-next'

export function analyticsEvent(name: string, category?: string, label?: string) {
  // eslint-disable-next-line node/prefer-global/process
  if (!process.client) {
    return
  }

  const id = useRuntimeConfig().public.googleAnalytics

  const { event: ev } = useGtag()
  const opt: Gtag.EventParams = {}

  if (category) {
    opt.event_category = category
  }

  if (label) {
    opt.event_label = label
  }

  console.debug('GA Event', name, opt)

  if (!id) {
    return
  }

  return ev(name, opt)
}
