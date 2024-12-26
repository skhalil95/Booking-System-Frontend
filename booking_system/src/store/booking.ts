import { Module } from 'vuex';
import api from '@/utils/api';
import { IBookingDTO } from '@/dto/IBookingDTO';

interface BookingState {
  bookings: IBookingDTO[];
  loading: boolean;
  error: string | null;
}

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
        const response = await api.get<IBookingDTO[]>('/get-bookings/');
        commit('SET_BOOKINGS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async createBooking({ dispatch }, bookingData: Omit<IBookingDTO, 'id'>) {
        try {
          const response = await api.post('/create-booking/', bookingData);
          dispatch('fetchBookings'); // Refresh the list after creating a booking
          return response.data; // Return the response for further handling
        } catch (error) {
          console.error('Error creating booking:', error.message);
          throw error; // Rethrow the error for handling in the calling function
        }
      },
  },
  getters: {
    allBookings: (state) => state.bookings,
    isLoading: (state) => state.loading,
    errorMessage: (state) => state.error,
  },
};

export default booking;
