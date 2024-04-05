<script setup lang="ts">
    import unmangleStoryName from '~/lib/unmangle';

    const dates = ref<Array<string>>([]);
    const selectedDate = ref<string>();
    const stories = ref<Array<string>>([]);
    const searchQuery = ref<string>('');

    watch(selectedDate, async (newSelectedDate) => {
        stories.value = await $fetch(`/api/library/${newSelectedDate}`) as Array<string>;
    });

    const goToStory = (story: string) => useRouter().push(`/library/${selectedDate.value}/${story}`);

    onMounted(async () => {
        dates.value = await $fetch(`/api/library`) as Array<string>;
        selectedDate.value = dates?.value[0];
    });

    const filteredStories = computed(() => {
        if (!searchQuery.value) {
            return stories.value;
        }
        const query = searchQuery.value.toLowerCase();
        return stories.value.filter(story => unmangleStoryName(story).toLowerCase().includes(query));
    });
</script>

<template>
    <UCard class="mt-36 mx-6 h-full">
        <template #header>
            <div>
                <h1 class="text-3xl mb-6">Library</h1>
                <div class="flex space-x-4">
                    <USelectMenu size="lg" v-model="selectedDate" :options="dates" class=""/>
                    <UInput
                        icon="i-heroicons-magnifying-glass-20-solid"
                        size="lg"
                        :trailing="false"
                        placeholder="Search..."
                        class="w-full"
                        v-model="searchQuery"
                    />
                </div>
            </div>
        </template>

        <div class="flex flex-col space-y-2">
            <div class="w-full" v-for="story in filteredStories" :key="story">
                <UButton truncate color="gray" size="lg" class="w-full text-xl" :label="unmangleStoryName(story)" icon="i-heroicons-book-open" @click="goToStory(story)"/>
            </div>
        </div>
        
    </UCard>
</template>