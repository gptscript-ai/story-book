<script setup lang="ts">
    import unmangleStoryName from '~/lib/unmangle';

    const dates = ref<Array<string>>([])
    const selectedDate = ref<string>()
    const stories = ref<Array<string>>([])

    watch(selectedDate, async (newSelectedDate) => {
        stories.value = await $fetch(`/api/library/${newSelectedDate}`) as Array<string>
    })

    const goToStory = (story: string) => useRouter().push(`/library/${selectedDate.value}/${story}`)
    onMounted(async () => {
        dates.value = await $fetch(`/api/library`) as Array<string>
        selectedDate.value = dates?.value[0]
    })
</script>

<template>
    <UCard class="mt-36 mx-6 h-full">
        <template #header>
            <h1 class="text-3xl mb-6">Library</h1>
            <USelectMenu v-model="selectedDate" :options="dates" class="md:w-1/6"/>
        </template>

        <div class="flex flex-col space-y-2">
            <div class="w-full" v-for="story in stories" >
                <UButton truncate color="gray" :key="story" size="lg" class="w-full text-xl" :label="unmangleStoryName(story)" icon="i-heroicons-book-open" @click="goToStory(story)"/>
            </div>
        </div>
        
    </UCard>
</template>