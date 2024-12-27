import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import AboutUsPage from '@/views/AboutUs.vue'; // Import the About Us page component
import ReservePage from '@/views/Reserve.vue'; // Import the Reserve page component

// Define the application routes
const routes = [
  { 
    path: '/', // Root path
    redirect: '/reserve' // Redirect root path to the '/reserve' route
  },
  {
    path: '/reserve', // Path for the reservation page
    component: ReservePage, // Component to render for this route
    meta: { title: 'Slot Reservation' }, // Meta information (e.g., page title)
  },
  {
    path: '/about-us', // Path for the About Us page
    component: AboutUsPage, // Component to render for this route
    meta: { title: 'About Us' }, // Meta information (e.g., page title)
  },
];

// Create the Vue Router instance
const router = createRouter({
  history: createWebHistory(), // Use HTML5 history mode for navigation
  routes, // Provide the defined routes
});

export default router; // Export the router instance for use in the app
