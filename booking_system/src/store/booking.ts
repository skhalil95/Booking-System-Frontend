import { Module } from 'vuex';
import api from '@/utils/api';
import { IBookingDTO } from '@/dto/IBookingDTO';

// Define the structure of the state
interface BookingState {
  bookings: IBookingDTO[]; // List of bookings
  loading: boolean; // Tracks loading state for asynchronous operations
  error: string | null; // Stores error messages if any
}

const API_BOOKINGS = '/bookings/'; // Base URL for the bookings API

const booking: Module<BookingState, any> = {
  namespaced: true, // Enable namespacing for this module
  state: {
    bookings: [], // Initialize bookings as an empty array
    loading: false, // Initialize loading state as false
    error: null, // Initialize error as null
  },
  mutations: {
    // Mutation to set the bookings state
    SET_BOOKINGS(state, bookings: IBookingDTO[]) {
      state.bookings = bookings;
    },
    // Mutation to set the loading state
    SET_LOADING(state, loading: boolean) {
      state.loading = loading;
    },
    // Mutation to set the error message
    SET_ERROR(state, error: string | null) {
      state.error = error;
    },
  },
  actions: {
    // Action to fetch all bookings from the server
    async fetchBookings({ commit }) {
      commit('SET_LOADING', true); // Start the loading indicator
      commit('SET_ERROR', null); // Clear any previous error
      try {
        const response = await api.get<IBookingDTO[]>(`${API_BOOKINGS}list/`); // Fetch bookings from API
        commit('SET_BOOKINGS', response.data); // Commit fetched bookings to state
      } catch (error: any) {
        commit('SET_ERROR', error.message); // Commit error message if fetching fails
      } finally {
        commit('SET_LOADING', false); // Stop the loading indicator
      }
    },
    // Action to create a new booking
    async createBooking({ dispatch }, bookingData: Omit<IBookingDTO, 'id'>) {
      try {
        const response = await api.post(`${API_BOOKINGS}create/`, bookingData); // Send booking data to API
        dispatch('fetchBookings'); // Refresh the list after creating a booking
        return response.data; // Return the response for further handling
      } catch (error: any) {
        console.error('Error creating booking:', error.message); // Log the error
        throw error; // Rethrow the error for handling in the calling function
      }
    },
    // Action to download a booking's PDF
    async downloadBookingPDF(_, bookingId: number) {
      try {
        // Explicitly tell Axios to expect a Blob response
        const response = await api.get<Blob>(`${API_BOOKINGS}pdf/`, {
          params: { booking_id: bookingId }, // Send booking ID as a parameter
          responseType: 'blob', // Specify response type as 'blob'
        });

        // Ensure TypeScript recognizes response.data as a Blob
        const blob = response.data;

        // Create a URL for the blob and trigger the download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Booking_${bookingId}.pdf`); // Set download filename
        document.body.appendChild(link); // Append link to the DOM
        link.click(); // Trigger download
        document.body.removeChild(link); // Clean up the DOM
      } catch (error: any) {
        console.error('Error downloading PDF:', error.response?.data?.error || error.message); // Log error details
        throw error; // Rethrow the error for handling in the calling function
      }
    },
  },
  getters: {
    // Getter to retrieve all bookings from the state
    allBookings: (state) => state.bookings,
    // Getter to check if data is being loaded
    isLoading: (state) => state.loading,
    // Getter to retrieve the error message
    errorMessage: (state) => state.error,
  },
};

export default booking;
