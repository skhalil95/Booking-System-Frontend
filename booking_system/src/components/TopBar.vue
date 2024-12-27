<template>
  <header class="bg-gray-200 p-4 flex items-center justify-between shadow-md">
    <h1 class="text-green-900 text-xl">{{ route.meta.title }}</h1>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
