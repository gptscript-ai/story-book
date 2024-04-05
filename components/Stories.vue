<script setup lang="ts">
import { useMainStore } from '@/store'
import unmangleStoryName from '@/lib/unmangle'

const store = useMainStore()
const stories = computed(() => store.stories)

onMounted(async () => { store.fetchStories() })
const goToStory = (name: string) => useRouter().push(`/story/${name}`)

// const deleteStory = async (name: string) => {
//     const response = await fetch(`/api/story/${name}`, { method: 'DELETE' })
//     if (response.ok) {
//         store.removeStory(name)
//         toast.add({
//             id: 'story-deleted',
//             title: `${name} deleted`,
//             description: 'The story has been deleted.',
//             icon: 'i-heroicons-trash',
//         })
//     } else {
//         toast.add({
//             id: 'story-delete-failed',
//             title: `Failed to delete ${name}`,
//             description: 'The story could not be deleted.',
//             icon: 'i-heroicons-x-mark',
//         })
//     }
// }
</script>

<template>
    <div class="flex flex-col space-y-2">        
        <div v-if="stories.length" class="w-full" v-for="story in stories" >
            <!-- The LLM likes to ocassionally, not always, generate folders with "-" and other times with " ", handle both cases for the button -->
            <UButton truncate color="gray" :key="story" size="lg" class="w-full text-xl" :label="unmangleStoryName(story)" icon="i-heroicons-book-open" @click="goToStory(story)"/>
        </div>
        <div v-else>
            <p class="text-gray-500">No stories have been made today. Want to be the first?</p>
        </div>
    </div>
</template>