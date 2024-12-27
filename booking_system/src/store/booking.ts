import { Module } from 'vuex';
import api from '@/utils/api';
import { IBookingDTO } from '@/dto/IBookingDTO';

interface BookingState {
  bookings: IBookingDTO[];
  loading: boolean;
  error: string | null;
}
const API_BOOKINGS = '/bookings/';

const booking: Module<BookingState, any> = {
  namespaced: true,
  state: {
    bookings: [],
    loading: false,
    error: null,
  },
  mutations: {
    SET_BOOKINGS(state, bookings: IBookingDTO[]) {
      state.bookings = bookings;
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading;
    },
    SET_ERROR(state, error: string | null) {
      state.error = error;
    },
  },
  actions: {
    async fetchBookings({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const response = await api.get<IBookingDTO[]>(`${API_BOOKINGS}list/`);
        commit('SET_BOOKINGS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async createBooking({ dispatch }, bookingData: Omit<IBookingDTO, 'id'>) {
        try {
          const response = await api.post(`${API_BOOKINGS}create/`, bookingData);
          dispatch('fetchBookings'); // Refresh the list after creating a booking
          return response.data; // Return the response for further handling
        } catch (error) {
          console.error('Error creating booking:', error.message);
          throw error; // Rethrow the error for handling in the calling function
        }
      },
      async downloadBookingPDF(_, bookingId: number) {
        try {
          // Explicitly tell Axios to expect a Blob response
          const response = await api.get<Blob>(`${API_BOOKINGS}pdf/`, {
            params: { booking_id: bookingId },
            responseType: 'blob', // Specify response type as 'blob'
          });
      
          // Ensure TypeScript recognizes response.data as a Blob
          const blob = response.data;
      
          // Create a URL for the blob and trigger the download
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `Booking_${bookingId}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error: any) {
          console.error('Error downloading PDF:', error.response?.data?.error || error.message);
          throw error; // Rethrow the error for handling in the calling function
        }
      }
          
      
  },
  getters: {
    allBookings: (state) => state.bookings,
    isLoading: (state) => state.loading,
    errorMessage: (state) => state.error,
  },
};

export default booking;
