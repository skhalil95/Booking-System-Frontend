<script setup>
import Sidebar from './components/Sidebar.vue';
import TopBar from './components/TopBar.vue';
import MainContent from './components/MainContent.vue';
</script>

<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 flex flex-col bg-gray-100 transition-all duration-300 main-content">
      <TopBar />
      <MainContent />
    </div>
  </div>
</template>

<style>
.main-content {
  overflow-x: auto;
}

</style>