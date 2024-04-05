<script setup lang="ts">
import { useMainStore } from '@/store'
import type { StreamEvent } from '@/lib/types'
const store = useMainStore()
const toast = useToast()
const pendingStories = computed(() => store.pendingStories)
const previousMessages = ref<Record<string, string>>({})
const messages = ref<Record<string, string>>({})
const es = ref<EventSource>()
const addMessage = (id:string, message: string) => {
    if (!messages.value[id]) messages.value[id] = ''
    if (!message) return
    messages.value[id] += message
}

onMounted(async () => store.fetchPendingStories() )
onBeforeUnmount(() => { es.value?.close() })
onBeforeMount(() => { 
    es.value = new EventSource('/api/story/sse')
    es.value.onmessage = (event) => {
        const e = JSON.parse(event.data) as StreamEvent
        addMessage(e.id, e.message)

        if (e.final) {
            store.fetchStories()
            if (e.error) {
                const truncatedPrompt = pendingStories.value[e.id].length > 50 ? pendingStories.value[e.id].substring(0, 50) + '...' : pendingStories.value[e.id]
                toast.add({
                    id: 'story-generating-failed',
                    title: `"${truncatedPrompt}" Generation Failed`,
                    description: `${previousMessages.value[e.id]}.`,
                    icon: 'i-heroicons-x-mark',
                    timeout: 30000,
                })
            } else {
                toast.add({
                    id: 'story-created',
                    title: 'Story Created',
                    description: `A story you requested has been created.`,
                    icon: 'i-heroicons-check-circle-solid',
                })
            }
            delete messages.value[e.id]
            store.fetchPendingStories()
        }

        // Previous message is stored for error handling. When an error occurs, the previous message is the error message.
        if (messages.value[e.id]) {
            previousMessages.value[e.id] = e.message
        }
    }}
)
</script>

<template>
    <div class="flex flex-col space-y-2">
        <New class="w-full"/>
        <UPopover mode="hover" v-for="(prompt, id) in pendingStories" >
            <UButton truncate loading :key="id" size="lg" class="w-full text-xl" color="white" :label="prompt" icon="i-heroicons-book-open"/>

            <template #panel>
                <UCard class="p-4 w-[80vw] xl:w-[40vw]">
                    <h1 class="text-xl">Writing the perfect story...</h1>
                    <h2 class="text-zinc-400 mb-4">GPTScript is currently writing a story. Curious? You can see what it is thinking below!</h2>
                    <pre class="h-[26vh] bg-zinc-950 px-6 text-white overflow-scroll rounded shadow flex flex-col-reverse" style="white-space: pre-line;">
                        {{ messages[id] ? messages[id] : 'Waiting for response...'}}
                    </pre>
                </UCard>
            </template>
        </UPopover>
    </div>
</template>