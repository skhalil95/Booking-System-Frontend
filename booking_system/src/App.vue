<script setup>
import Sidebar from './components/Sidebar.vue';
import TopBar from './components/TopBar.vue';
import MainContent from './components/MainContent.vue';
</script>

<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 flex flex-col bg-gray-100">
      <TopBar />
      <MainContent />
    </div>
  </div>
</template>
