<script setup lang="ts">
const isMenuOpen = ref(false)
const openSource = () => window.open('https://github.com/gptscript-ai/story-book', '_blank')
const openGPTScript = () => window.open('https://github.com/gptscript-ai/gptscript', '_blank')
</script>

<template>
  <div>
    <div class="flex w-full p-4 md:p-10 justify-end">
        <UButton size="xl" icon="i-heroicons-bars-3" color="white" @click="isMenuOpen = true" />
    </div>

    <USlideover v-model="isMenuOpen">
        <UCard class="flex flex-col flex-1 overflow-y-scroll" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-4xl">Story Book</h3>
                    <div class="flex space-x-4">
                        <DisplayMode size="lg" color="white"/>
                        <UButton size="lg" icon="i-heroicons-x-mark-20-solid" color="white" @click="isMenuOpen = false" />
                    </div>    
                </div>
                <UDivider class="mt-4"/>
                <h3 class="text-2xl mt-4">Navigation</h3>
                <UButton color="gray" class="mt-6 text-xl w-full" size="xl" label="Home" icon="i-heroicons-home" @click="() => { useRouter().push('/'); isMenuOpen = false }"/>
                <UButton color="gray" class="mt-2 text-xl w-full" size="xl" label="Source Code" icon="i-heroicons-arrow-top-right-on-square" @click="() => { openSource(); isMenuOpen = false }"/>
                <UButton color="gray" class="mt-2 text-xl w-full" size="xl" label="GPTScript" icon="i-heroicons-arrow-top-right-on-square" @click="() => { openGPTScript(); isMenuOpen = false }"/>
            </template>
            <h3 class="text-2xl mb-6">Stories</h3>
            <Stories @click="(isMenuOpen = false)"/>
        </UCard>
    </USlideover>
  </div>
</template>