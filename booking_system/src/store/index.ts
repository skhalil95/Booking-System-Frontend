import { createStore } from 'vuex';
import booking from './booking'; // Import the booking module

// Create and export the Vuex store
export default createStore({
  modules: {
    booking, // Register the booking module
  },
});
