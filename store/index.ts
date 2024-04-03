// store/index.ts
import { defineStore } from 'pinia'
import type { PendingStory } from '@/lib/types'

export const useMainStore = defineStore({
    id: 'main',
    state: () => ({
        pendingStories: [] as PendingStory[],
        stories: [] as string[]
    }),
    actions: {
        addStory(name: string) {
            this.stories.push(name)
        },
        addStories(names: string[]) {
            names.forEach(name => {
                if (!this.stories.includes(name)) {
                    this.stories.push(name)
                }
            })
        },
        removeStory(name: string) {
            this.stories = this.stories.filter(s => s !== name)
        },
        async fetchStories() {
            this.addStories(await $fetch('/api/story') as string[])
        },
        async fetchPendingStories() {
            this.pendingStories = await $fetch('/api/story/pending') as PendingStory[]
        }   
    }
})