import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StorageService, BookingRecord } from '../services/storage';

export interface BookingState {
  activeCounsellor: any | null;
  selectedSessionType: 'Chat' | 'Voice' | 'Video';
  selectedDateText: string;
  selectedTimeText: string;
  confirmedBookings: BookingRecord[];
  latestConfirmedBooking: BookingRecord | null;
}

const initialState: BookingState = {
  activeCounsellor: null,
  selectedSessionType: 'Chat',
  selectedDateText: '',
  selectedTimeText: '10:00 AM',
  confirmedBookings: StorageService.getBookings(),
  latestConfirmedBooking: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setActiveCounsellor(state, action: PayloadAction<any>) {
      state.activeCounsellor = action.payload;
    },
    setSessionType(state, action: PayloadAction<'Chat' | 'Voice' | 'Video'>) {
      state.selectedSessionType = action.payload;
    },
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDateText = action.payload;
    },
    setSelectedTime(state, action: PayloadAction<string>) {
      state.selectedTimeText = action.payload;
    },
    confirmBooking(state, action: PayloadAction<Omit<BookingRecord, 'id' | 'createdAt'>>) {
      const newBooking: BookingRecord = {
        ...action.payload,
        id: `book_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      state.latestConfirmedBooking = newBooking;
      state.confirmedBookings = [newBooking, ...state.confirmedBookings];
      // Persist to MMKV Storage
      StorageService.saveBookings(state.confirmedBookings);
    },
    loadBookingsFromStorage(state) {
      state.confirmedBookings = StorageService.getBookings();
    },
    clearLatestBooking(state) {
      state.latestConfirmedBooking = null;
    },
  },
});

export const {
  setActiveCounsellor,
  setSessionType,
  setSelectedDate,
  setSelectedTime,
  confirmBooking,
  loadBookingsFromStorage,
  clearLatestBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
