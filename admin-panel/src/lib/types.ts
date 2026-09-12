export interface Admin {
  id: string
  email: string
  name: string
  role: 'superadmin' | 'admin'
  isActive: boolean
  lastLoginAt?: string
  createdAt?: string
}

export interface PageMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface User {
  _id: string
  phone: string
  name?: string
  gender?: string
  userType: 'client' | 'counsellor'
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface Counsellor {
  _id: string
  userId?: string
  fullName: string
  phone: string
  gender?: string
  title?: string
  avatar?: string
  areasOfFocus?: string[]
  experienceYears?: number
  languages?: string[]
  rates?: { chat?: number; voice?: number; video?: number }
  certificates?: string[]
  rating?: number
  reviewCount?: number
  bio?: string
  availableSlots?: string[]
  approvalStatus?: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  reviewedAt?: string
  isVerified?: boolean
  isOnboardingComplete?: boolean
  hasFreeSessionOffer?: boolean
  freeSessionDurationText?: string
  createdAt?: string
  updatedAt?: string
}

export interface Booking {
  _id: string
  clientId?: string | { _id: string; name?: string; phone?: string }
  counsellorId?: string | { _id: string; fullName?: string; phone?: string; title?: string }
  counsellorName: string
  clientName?: string
  clientPhone?: string
  sessionType: 'Chat' | 'Voice' | 'Video'
  dateText: string
  timeText: string
  price: string
  status: 'confirmed' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'completed' | 'failed' | 'free'
  paymentMethod?: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface DashboardOverview {
  stats: {
    totalUsers: number
    totalClients: number
    totalCounsellors: number
    verifiedCounsellors: number
    pendingCounsellors: number
    newUsers30d: number
    totalBookings: number
    completedBookings: number
    confirmedBookings: number
    cancelledBookings: number
    grossRevenue: number
    grossRevenueText: string
    revenue30d: number
    revenue30dText: string
  }
  breakdown: {
    byStatus: Record<string, number>
    bySessionType: Record<string, number>
    byPaymentStatus: Record<string, number>
  }
  timeseries: { date: string; bookings: number; revenue: number }[]
}
