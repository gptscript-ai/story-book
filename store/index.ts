// store/index.ts
import { defineStore } from 'pinia'

export const useMainStore = defineStore({
    id: 'main',
    state: () => ({
        pendingStories: [] as string[],
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
        addPendingStory(name: string) {
            this.pendingStories.push(name)
        },
        addPendingStories(names: string[]) {
            names.forEach(name => {
                if (!this.pendingStories.includes(name)) {
                    this.pendingStories.push(name)
                }
            })
        },
        removePendingStory(name: string) {
            this.stories = this.stories.filter(s => s !== name)
        },
        async fetchPendingStories() {
            this.pendingStories = await $fetch('/api/story/pending') as string[]
        }   
    }
})