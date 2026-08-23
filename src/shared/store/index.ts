import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
import bookingReducer from './bookingSlice';
import { clientApi } from './api/clientApi';
import { counsellorApi } from './api/counsellorApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [counsellorApi.reducerPath]: counsellorApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(clientApi.middleware, counsellorApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for components
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
