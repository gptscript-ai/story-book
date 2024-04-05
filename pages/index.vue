<script setup lang="ts">
    import { useMainStore } from '@/store'
    const store = useMainStore()
    onMounted(async () => store.fetchStories() )
</script>

<template>
    <UContainer class="w-full h-full flex items-center justify-center">
        <div class="w-full h-full md:h-1/2 p-2 mt-32">
            <h1 class="text-4xl text-center">Welcome to the Story Book!</h1>
            <h2 class="mt-6 text-xl text-center text-gray-500">
                Select one of today's story below or generate a new one. You can also
                <a href="/library" class="mt-8 text-center text-blue-500 underline">go to the Library</a>
                for stories from previous days.
            </h2>
            <div class="flex mt-10 flex-col space-y-10 lg:flex-row lg:space-x-10 lg:space-y-0">
                <UCard class="w-full lg:w-1/2">
                    <template #header>
                        <h1>Generate a new story</h1>
                    </template>
                    <PendingStories />
                </UCard>
                <UCard class="w-full lg:w-1/2">
                    <template #header>
                        <h1>Today's Stories</h1>
                    </template>
                    <Stories />
                </UCard>
            </div>
        </div>
    </UContainer>
</template>