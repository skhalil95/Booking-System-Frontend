
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import AboutUsPage from '@/views/AboutUs.vue';
import ReservePage from '@/views/Reserve.vue';

const routes = [
    { path: '/', redirect: '/reserve' },
    {
      path: '/reserve',
      component: ReservePage,
      meta: { title: 'Slot Reservation' }, // Add meta title
    },
    {
      path: '/about-us',
      component: AboutUsPage,
      meta: { title: 'About Us' }, // Add meta title
    },
  ];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
