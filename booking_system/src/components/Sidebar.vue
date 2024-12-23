<template>
  <aside
    :class="[
      'h-screen bg-green-900 text-white flex flex-col items-center transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64',
    ]"
    @mouseover="expandSidebar"
    @mouseleave="collapseSidebar"
  >
    <div class="flex justify-center items-center mt-4">
      <img src="../assets/logo.svg" alt="Logo" class="h-10 w-auto" />
    </div>
    <nav v-if="!isCollapsed" class="mt-6 w-full">
      <ul class="space-y-4">
        <li><a href="#" class="block px-4 py-2 hover:bg-green-700 rounded">My Bookings</a></li>
        <li><a href="#" class="block px-4 py-2 hover:bg-green-700 rounded">Reserve</a></li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue';

const isCollapsed = ref(true);

function expandSidebar() {
  isCollapsed.value = false;
}

function collapseSidebar() {
  isCollapsed.value = true;
}
</script>
