import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StorageService, UserSession } from '../services/storage';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserSession['user'] | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
};

/**
 * Async Thunk: Restores session from local storage on app launch
 */
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async () => {
    const session = await StorageService.getSession();
    return session;
  }
);

/**
 * Async Thunk: Saves user session to storage and sets authenticated
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (session: UserSession) => {
    await StorageService.saveSession(session);
    return session;
  }
);

/**
 * Async Thunk: Clears user session from storage and logs out
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    await StorageService.clearSession();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<UserSession>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      // restoreSession
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload.token) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })

      // loginUser
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
