<template>
  <aside
    :class="[ 
      'bg-green-900 text-white flex flex-col items-center transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    ]"
    @mouseover="expandSidebar"
    @mouseleave="collapseSidebar"
  >
    <!-- Logo -->
    <div class="flex justify-center items-center mt-4">
      <img src="../assets/logo.svg" alt="Logo" class="h-10 w-auto" />
    </div>
    <!-- Navigation -->
    <nav class="mt-6 w-full">
      <ul class="space-y-4">
        <li>
          <router-link
            to="/reserve"
            class="flex items-center px-4 py-2 rounded hover:bg-green-700 transition"
            :class="{ 'bg-green-700': $route.path === '/reserve' }"
          >
            <q-icon v-if="isCollapsed" name="event" size="sm" />
            <span v-else class="flex items-center">
              <q-icon name="event" size="sm" class="mr-2" />
              Reserve
            </span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/about-us"
            class="flex items-center px-4 py-2 rounded hover:bg-green-700 transition"
            :class="{ 'bg-green-700': $route.path === '/about-us' }"
          >
            <q-icon v-if="isCollapsed" size="sm" name="groups" />
            <span v-else class="flex items-center">
              <q-icon name="groups" size="sm" class="mr-2" />
              About Us
            </span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const isCollapsed = ref(true);
const $route = useRoute();

function expandSidebar() {
  isCollapsed.value = false;
}

function collapseSidebar() {
  isCollapsed.value = true;
}
</script>

<style scoped>
aside {
  height: 100vh; /* Ensures the sidebar takes the full viewport height */
  flex-shrink: 0; /* Prevent shrinking in flex layouts */
  overflow-y: auto; /* Add a scrollbar if the content overflows */
}
</style>
