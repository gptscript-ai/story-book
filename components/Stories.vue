<script setup lang="ts">
import { useMainStore } from '@/store'
import unmangleStoryName from '@/lib/unmangle'

const toast = useToast()
const store = useMainStore()
const stories = computed(() => store.stories)

onMounted(async () => { store.fetchStories() })
const goToStory = (name: string) => useRouter().push(`/story/${name}`)

const deleteStory = async (name: string) => {
    const response = await fetch(`/api/story/${name}`, { method: 'DELETE' })
    if (response.ok) {
        store.removeStory(name)
        toast.add({
            id: 'story-deleted',
            title: `${name} deleted`,
            description: 'The story has been deleted.',
            icon: 'i-heroicons-trash',
        })
    } else {
        toast.add({
            id: 'story-delete-failed',
            title: `Failed to delete ${name}`,
            description: 'The story could not be deleted.',
            icon: 'i-heroicons-x-mark',
        })
    }
}
</script>

<template>
    <div class="flex flex-col space-y-2">        
        <div class="w-full" v-for="story in stories" >
            <!-- The LLM likes to ocassionally, not always, generate folders with "-" and other times with " ", handle both cases for the button -->
            <UButton truncate :key="story" size="lg" class="w-5/6 text-xl" :label="unmangleStoryName(story)" icon="i-heroicons-book-open" @click="goToStory(story)"/>
            <UButton size="lg" variant="ghost" class="w-1/6 text-xl" icon="i-heroicons-trash" @click="deleteStory(story)"/>
        </div>
    </div>
</template>