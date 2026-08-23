import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCounsellorBaseUrl } from '../../utils/config';

export interface SendCounsellorOtpRequest {
  phone: string;
}

export interface VerifyCounsellorOtpRequest {
  phone: string;
  otp: string;
}

export interface OnboardingRequest {
  phone: string;
  fullName?: string;
  gender?: string;
  areasOfFocus?: string[];
  experienceYears?: number;
  languages?: string[];
  rates?: { chat: number; voice: number; video: number };
  certificates?: string[];
  bio?: string;
}

export interface UpdateSettingsRequest {
  phone: string;
  rates?: { chat: number; voice: number; video: number };
  availableSlots?: string[];
}

const dynamicBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const baseUrl = getCounsellorBaseUrl();
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  });
  return rawBaseQuery(args, api, extraOptions);
};

export const counsellorApi = createApi({
  reducerPath: 'counsellorApi',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['CounsellorProfile', 'Dashboard'],
  endpoints: (builder) => ({
    // Auth & Onboarding Endpoints
    sendCounsellorOTP: builder.mutation<{ success: boolean; message: string; otp?: string }, SendCounsellorOtpRequest>({
      query: (body) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body,
      }),
    }),
    verifyCounsellorOTP: builder.mutation<{ success: boolean; token: string; counsellor: any; user: any }, VerifyCounsellorOtpRequest>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CounsellorProfile', 'Dashboard'],
    }),
    completeOnboarding: builder.mutation<{ success: boolean; message: string; data: any }, OnboardingRequest>({
      query: (body) => ({
        url: '/auth/onboarding',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['CounsellorProfile', 'Dashboard'],
    }),
    getCounsellorProfile: builder.query<{ success: boolean; data: any }, string>({
      query: (phone) => `/auth/profile/${phone}`,
      providesTags: ['CounsellorProfile'],
    }),

    // Dashboard Endpoints
    getDashboardOverview: builder.query<{ success: boolean; stats: any; upcomingBookings: any[] }, string>({
      query: (phone) => `/dashboard/overview/${phone}`,
      providesTags: ['Dashboard'],
    }),
    updateCounsellorSettings: builder.mutation<{ success: boolean; message: string; data: any }, UpdateSettingsRequest>({
      query: (body) => ({
        url: '/dashboard/settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['CounsellorProfile', 'Dashboard'],
    }),
  }),
});

export const {
  useSendCounsellorOTPMutation,
  useVerifyCounsellorOTPMutation,
  useCompleteOnboardingMutation,
  useGetCounsellorProfileQuery,
  useGetDashboardOverviewQuery,
  useUpdateCounsellorSettingsMutation,
} = counsellorApi;
