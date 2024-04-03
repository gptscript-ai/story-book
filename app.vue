<script lang="ts" setup>
useHead({
  title: 'Story Book',
  meta:  [
    { charset: 'utf-8' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'viewport', content: `width=device-width` },
  ],
})
</script>

<template>
  <div>
    <div class="grid fixed top-0 right-0 bottom-0 left-0">
      <div class="overflow-auto order-transparent">
        <Nav class="absolute w-full right-0 top-0 z-10"/>
        <div class="max-w-full w-full mx-auto my-14">
          <NuxtPage class="" />
        </div>
      </div>
    </div>
    <UNotifications />
  </div>
</template>
