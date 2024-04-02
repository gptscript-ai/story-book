<script setup lang="ts">
    import { useMainStore } from '@/store'
    const store = useMainStore()
    onMounted(async () => store.fetchStories() )
</script>

<template>
    <div class="w-full h-full flex items-center justify-center">
        <UCard class="w-full md:w-4/5 lg:w-1/2 h-full md:h-1/2 p-10 overflow-y-scroll mt-32">
            <h1 class="text-4xl text-center">Welcome to the Story Book!</h1>
            <h2 class="mt-6 text-xl text-center text-gray-500">Select a story below or generate a new one.</h2>
            <UDivider class="w-full my-10">Existing stories</UDivider>  
            <Stories />
        </UCard>
    </div>
</template>