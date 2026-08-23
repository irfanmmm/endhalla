import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getClientBaseUrl } from '../../utils/config';

export interface SendOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface UpdateProfileRequest {
  phone: string;
  name: string;
  gender: string;
}

export interface CreateBookingRequest {
  counsellorId?: string;
  counsellorName: string;
  clientPhone?: string;
  clientName?: string;
  sessionType: 'Chat' | 'Voice' | 'Video';
  dateText: string;
  timeText: string;
  price: string | number;
  notes?: string;
}

export interface GetCounsellorsQueryArgs {
  query?: string;
  category?: string;
  gender?: string;
  maxPrice?: number;
  minExperience?: number;
  sortBy?: 'rating' | 'experience' | 'price_low';
}

export interface CounsellorItem {
  _id: string;
  userId?: string;
  fullName: string;
  phone?: string;
  gender?: string;
  title: string;
  avatar: string;
  areasOfFocus: string[];
  experienceYears: number;
  languages: string[];
  rates: {
    chat: number;
    voice: number;
    video: number;
  };
  certificates?: string[];
  rating: number;
  reviewCount: number;
  bio: string;
  availableSlots: string[];
  isVerified?: boolean;
  isOnboardingComplete?: boolean;
  hasFreeSessionOffer?: boolean;
  freeSessionDurationText?: string;
  voiceNote?: {
    audioUrl?: string;
    duration?: string;
    quote?: string;
  };
}

const dynamicBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const baseUrl = getClientBaseUrl();
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  });
  return rawBaseQuery(args, api, extraOptions);
};

export const clientApi = createApi({
  reducerPath: 'clientApi',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['Profile', 'Counsellor', 'Booking'],
  endpoints: (builder) => ({
    // Auth Endpoints
    sendClientOTP: builder.mutation<{ success: boolean; message: string; otp?: string }, SendOtpRequest>({
      query: (body) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body,
      }),
    }),
    verifyClientOTP: builder.mutation<{ success: boolean; token: string; user: any; isExistingUser?: boolean }, VerifyOtpRequest>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    loginClient: builder.mutation<{ success: boolean; token: string; user: any; isExistingUser?: boolean }, { phone: string; otp?: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    updateClientProfile: builder.mutation<{ success: boolean; user: any }, UpdateProfileRequest>({
      query: (body) => ({
        url: '/auth/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    getClientProfile: builder.query<{ success: boolean; user: any }, string>({
      query: (phone) => `/auth/profile/${phone}`,
      providesTags: ['Profile'],
    }),

    // Counsellor Search & Catalog Endpoints
    getCounsellors: builder.query<{ success: boolean; count: number; data: any[] }, GetCounsellorsQueryArgs | void>({
      query: (args) => {
        if (!args) return '/counsellors';
        const params = new URLSearchParams();
        if (args.query) params.append('query', args.query);
        if (args.category) params.append('category', args.category);
        if (args.gender) params.append('gender', args.gender);
        if (args.maxPrice) params.append('maxPrice', String(args.maxPrice));
        if (args.minExperience) params.append('minExperience', String(args.minExperience));
        if (args.sortBy) params.append('sortBy', args.sortBy);
        return `/counsellors?${params.toString()}`;
      },
      providesTags: ['Counsellor'],
    }),
    getCounsellorById: builder.query<{ success: boolean; data: any }, string>({
      query: (id) => `/counsellors/${id}`,
      providesTags: ['Counsellor'],
    }),
    getCategories: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => '/counsellors/categories',
    }),

    // Booking Endpoints
    createBooking: builder.mutation<{ success: boolean; message: string; data: any }, CreateBookingRequest>({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Booking'],
    }),
    createRazorpayOrder: builder.mutation<{ success: boolean; orderId: string; amount: number; currency: string; keyId: string }, { counsellorId?: string; counsellorName?: string; sessionType?: string; amount?: number | string; currency?: string }>({
      query: (body) => ({
        url: '/bookings/create-razorpay-order',
        method: 'POST',
        body,
      }),
    }),
    verifyRazorpayPayment: builder.mutation<{ success: boolean; message: string; data: any }, {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      counsellorId?: string;
      counsellorName: string;
      clientPhone?: string;
      clientName?: string;
      sessionType: 'Chat' | 'Voice' | 'Video';
      dateText: string;
      timeText: string;
      price: string | number;
      notes?: string;
    }>({
      query: (body) => ({
        url: '/bookings/verify-razorpay-payment',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Booking'],
    }),
    getClientBookings: builder.query<{ success: boolean; count: number; data: any[] }, string>({
      query: (phone) => `/bookings/client/${phone}`,
      providesTags: ['Booking'],
    }),
    getBookedSlots: builder.query<{ success: boolean; count: number; bookedSlots: string[] }, { counsellorName: string; dateText: string }>({
      query: ({ counsellorName, dateText }) => `/bookings/booked-slots?counsellorName=${encodeURIComponent(counsellorName)}&dateText=${encodeURIComponent(dateText)}`,
      providesTags: ['Booking'],
    }),
    cancelBooking: builder.mutation<{ success: boolean; data: any }, string>({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const {
  useSendClientOTPMutation,
  useVerifyClientOTPMutation,
  useLoginClientMutation,
  useUpdateClientProfileMutation,
  useGetClientProfileQuery,
  useLazyGetClientProfileQuery,
  useGetCounsellorsQuery,
  useGetCounsellorByIdQuery,
  useGetCategoriesQuery,
  useCreateBookingMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useGetClientBookingsQuery,
  useGetBookedSlotsQuery,
  useCancelBookingMutation,
} = clientApi;
