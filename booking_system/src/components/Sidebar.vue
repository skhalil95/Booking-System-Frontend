<template>
  <!-- Sidebar container -->
  <aside
    :class="[ 
      'bg-blue-200 text-white flex flex-col items-center transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    ]"
    @mouseover="expandSidebar"
    @mouseleave="collapseSidebar"
  >
    <!-- Logo Section -->
    <div class="flex justify-center items-center mt-4">
      <!-- Logo Image -->
      <img src="../assets/gust.svg" alt="Logo" class="h-10 w-auto" />
    </div>

    <!-- Navigation Section -->
    <nav class="mt-6 w-full">
      <ul class="space-y-4"> <!-- Add spacing between navigation items -->
        <!-- Reserve Navigation Item -->
        <li>
          <router-link
            to="/reserve"
            class="flex items-center px-4 py-2 rounded hover:bg-blue-500 transition"
            :class="{ 'bg-blue-500': $route.path === '/reserve' }"
          >
            <!-- Icon when sidebar is collapsed -->
            <q-icon v-if="isCollapsed" name="event" size="sm" class="color"/>
            <!-- Icon and label when sidebar is expanded -->
            <span v-else class="flex items-center color">
              <q-icon name="event" size="sm" class="mr-2" />
              Reserve
            </span>
          </router-link>
        </li>

        <!-- About Us Navigation Item -->
        <li>
          <router-link
            to="/about-us"
            class="flex items-center px-4 py-2 rounded hover:bg-blue-500 transition"
            :class="{ 'bg-blue-500': $route.path === '/about-us' }"
          >
            <!-- Icon when sidebar is collapsed -->
            <q-icon v-if="isCollapsed" size="sm" name="groups" class="color"/>
            <!-- Icon and label when sidebar is expanded -->
            <span v-else class="flex items-center  color">
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
import { ref } from 'vue'; // Import ref for reactive variables
import { useRoute } from 'vue-router'; // Import useRoute for accessing the current route

// Reactive variable to track whether the sidebar is collapsed
const isCollapsed = ref(true);

// Get the current route for active link highlighting
const $route = useRoute();

// Expand the sidebar by setting isCollapsed to false
function expandSidebar() {
  isCollapsed.value = false;
}

// Collapse the sidebar by setting isCollapsed to true
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

.color {
  color: rgb(20, 0, 102);
}
</style>
