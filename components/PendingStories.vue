<script setup lang="ts">
import { useMainStore } from '@/store'
const store = useMainStore()
const toast = useToast()
const pendingStories = computed(() => store.pendingStories)
const lastViewedId= ref('')
const messages = ref<string[]>([])
const MAX_MESSAGES = 20
const eventSource = ref<EventSource>()

onMounted(async () => { store.fetchPendingStories() })

const addMessage = (message: string) => {
    messages.value.push(message)
    if (messages.value.length > MAX_MESSAGES) {
        messages.value.shift()
    }
}

const onHover = async (id: string) => {
    if (lastViewedId.value !== id) {
        messages.value = ['Connected, waiting for first message...']
        if (eventSource.value) {
            eventSource.value.close()
        }
        lastViewedId.value = id
    } else {
        return
    }

    const es = new EventSource(`/api/story/sse?id=${id}`)
    es.onmessage = async (event) => {
        addMessage(event.data)
        if ((event.data as string) === 'done') {
            es.close()
            store.fetchPendingStories()
            store.fetchStories()
            toast.add({
                id: 'story-created',
                title: 'Story Created',
                description: `A story you requested has been created.`,
                icon: 'i-heroicons-check-circle-solid',
            })
        } else if ((event.data as string).includes('done:') ){
            es.close()
            store.fetchPendingStories()
            let message = event.data.substring(event.data.indexOf('done:') + 5).replace('\n', '')
            toast.add({
                id: 'story-generating-failed',
                title: 'Story Generation Failed',
                description: `Your story could not be generated due to an error: ${message}.`,
                icon: 'i-heroicons-x-mark',
                timeout: 30000,
            })
        } else if ((event.data as string).includes('error')) {
            es.close()
            store.fetchPendingStories()
            toast.add({
                id: 'story-generating-failed',
                title: 'Story Generation Failed',
                description: `Your story could not be generated due to an error: ${event.data}.`,
                icon: 'i-heroicons-x-mark',
                timeout: 30000,
            })
        }
    }
    eventSource.value = es
}
</script>

<template>
    <div class="flex flex-col space-y-2">
        <New class="w-full"/>
        <UPopover mode="hover" v-for="ps in pendingStories" >
            <UButton truncate loading :key="ps.id" size="lg" class="w-full text-xl" color="white" :label="ps.prompt" icon="i-heroicons-book-open" @mouseover="onHover(ps.id)"/>

            <template #panel>
                <UCard class="p-4 w-[80vw] xl:w-[40vw]">
                    <h1 class="text-xl">Writing the perfect story...</h1>
                    <h2 class="text-zinc-400 mb-4">GPTScript is currently writing a story. Curious? You can see what it is thinking below!</h2>
                    <pre class="h-[26vh] bg-zinc-950 px-6 text-white overflow-x-scroll rounded shadow">
                        <p v-for="message in messages">> {{ message }}</p>
                    </pre>
                </UCard>
            </template>
        </UPopover>
    </div>
</template>