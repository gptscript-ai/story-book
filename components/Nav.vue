<script setup lang="ts">
const isMenuOpen = ref(false)
</script>

<template>
  <div>
    <div class="flex w-full p-4 md:p-10 justify-end">
        <UButton size="xl" icon="i-heroicons-bars-3" color="white" @click="isMenuOpen = true" />
    </div>

    <USlideover v-model="isMenuOpen">
        <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-4xl">Story Book</h3>
                    <div class="flex space-x-4">
                        <DisplayMode size="lg" color="white"/>
                        <UButton size="lg" icon="i-heroicons-x-mark-20-solid" color="white" @click="isMenuOpen = false" />
                    </div>    
                </div>
                <UButton color="gray" class="mt-6 text-xl w-full" size="xl" label="Home" icon="i-heroicons-home" @click="() => { useRouter().push('/'); isMenuOpen = false }"/>
            </template>
            <Stories @click="(isMenuOpen = false)"/>
        </UCard>
    </USlideover>
  </div>
</template>