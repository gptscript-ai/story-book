<script setup lang="ts">
import { useMainStore } from '@/store'
const store = useMainStore()
const toast = useToast()
const pendingStories = computed(() => store.pendingStories)
const lastViewedPrompt= ref('')
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

const onHover = async (prompt: string) => {
    if (lastViewedPrompt.value !== prompt) {
        messages.value = ['Connecting to server...']
        if (eventSource.value) {
            eventSource.value.close()
        }
        lastViewedPrompt.value = prompt
    } else {
        return
    }

    const es = new EventSource(`/api/story/sse?prompt=${prompt}`)
    es.onmessage = async (event) => {
        addMessage(event.data)
        if ((event.data as string) === 'done') {
            es.close()
            store.fetchPendingStories()
            store.fetchStories()
            toast.add({
                id: 'story-created',
                title: 'Story Created',
                description: 'A story you requested has been created.',
                icon: 'i-heroicons-check-circle-solid',
            })
        } else if ((event.data as string).includes('error')) {
            es.close()
            store.fetchPendingStories()
            store.removePendingStory(prompt)
            toast.add({
                id: 'story-generating-failed',
                title: 'Story Generation Failed',
                description: `Your story could not be generated due to an error.\n\n${event.data}.`,
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
        <UPopover mode="hover" v-for="prompt in pendingStories" >
            <UButton truncate loading :key="prompt" size="lg" class="w-full text-xl" color="white" :label="prompt" icon="i-heroicons-book-open" @mouseover="onHover(prompt)"/>

            <template #panel>
                <UCard class="p-4 w-[80vw] xl:w-[40vw]">
                    <h1 class="text-xl">Writing the perfect story...</h1>
                    <h2 class="text-zinc-400 mb-4">GPTScript is currently building the story you requested. You can see its progress below.</h2>
                    <pre class="h-[26vh] bg-zinc-950 px-6 text-white overflow-x-scroll rounded shadow">
                        <p v-for="message in messages">> {{ message }}</p>
                    </pre>
                </UCard>
            </template>
        </UPopover>
    </div>
</template>