import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import { AppState, AppStateStatus } from 'react-native';
import authReducer from './authSlice';
import bookingReducer from './bookingSlice';
import counsellorOnboardingReducer from './counsellorOnboardingSlice';
import { clientApi } from './api/clientApi';
import { counsellorApi } from './api/counsellorApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    counsellorOnboarding: counsellorOnboardingReducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [counsellorApi.reducerPath]: counsellorApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(clientApi.middleware, counsellorApi.middleware),
});

// Without this, RTK Query has no concept of "backgrounded" on React Native
// (its default focus tracking is web-only, via document.visibilitychange) —
// any pollingInterval query just keeps firing via a bare setInterval even
// while the app is backgrounded or the screen is locked. Wiring AppState in
// lets skipPollingIfUnfocused (used by polling queries) actually pause.
setupListeners(store.dispatch, (dispatch, { onFocus, onFocusLost }) => {
  const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
    if (state === 'active') dispatch(onFocus());
    else dispatch(onFocusLost());
  });
  return () => subscription.remove();
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for components
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
