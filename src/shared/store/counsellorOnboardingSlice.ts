import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CounsellorOnboardingState {
  phone: string;
  fullName: string;
  gender: string;
  experienceYears: number;
  rates: { chat: number; voice: number; video: number };
  languages: string[];
  areasOfFocus: string[];
  certificates: string[];
}

const initialState: CounsellorOnboardingState = {
  phone: '',
  fullName: '',
  gender: '',
  experienceYears: 0,
  rates: { chat: 0, voice: 0, video: 0 },
  languages: [],
  areasOfFocus: [],
  certificates: [],
};

const counsellorOnboardingSlice = createSlice({
  name: 'counsellorOnboarding',
  initialState,
  reducers: {
    setOnboardingPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
    },
    setOnboardingFullName(state, action: PayloadAction<string>) {
      state.fullName = action.payload;
    },
    setOnboardingGender(state, action: PayloadAction<string>) {
      state.gender = action.payload;
    },
    setOnboardingExperienceYears(state, action: PayloadAction<number>) {
      state.experienceYears = action.payload;
    },
    setOnboardingRates(state, action: PayloadAction<{ chat: number; voice: number; video: number }>) {
      state.rates = action.payload;
    },
    setOnboardingLanguages(state, action: PayloadAction<string[]>) {
      state.languages = action.payload;
    },
    setOnboardingAreasOfFocus(state, action: PayloadAction<string[]>) {
      state.areasOfFocus = action.payload;
    },
    setOnboardingCertificates(state, action: PayloadAction<string[]>) {
      state.certificates = action.payload;
    },
    resetOnboarding() {
      return initialState;
    },
  },
});

export const {
  setOnboardingPhone,
  setOnboardingFullName,
  setOnboardingGender,
  setOnboardingExperienceYears,
  setOnboardingRates,
  setOnboardingLanguages,
  setOnboardingAreasOfFocus,
  setOnboardingCertificates,
  resetOnboarding,
} = counsellorOnboardingSlice.actions;

export default counsellorOnboardingSlice.reducer;
