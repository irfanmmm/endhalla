import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || ''

export const TOKEN_KEY = 'endhalla_admin_token'

export const api = axios.create({
  baseURL: `${BASE}/api/admin`,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && !location.pathname.startsWith('/login')) {
      localStorage.removeItem(TOKEN_KEY)
      location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export function apiError(err: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message || fallback
  }
  return fallback
}
