import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { PendingProvider } from './context/PendingContext'
import { LoadingBlock } from './components/ui'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Counsellors from './pages/Counsellors'
import CounsellorDetail from './pages/CounsellorDetail'
import Approvals from './pages/Approvals'
import Users from './pages/Users'
import UserDetail from './pages/UserDetail'
import Bookings from './pages/Bookings'
import Payments from './pages/Payments'
import Settings from './pages/Settings'

function Protected({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAuth()
  if (loading) return <LoadingBlock />
  if (!admin) return <Navigate to="/login" replace />
  return <PendingProvider>{children}</PendingProvider>
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/approvals" element={<Approvals />} />
        <Route path="/counsellors" element={<Counsellors />} />
        <Route path="/counsellors/:id" element={<CounsellorDetail />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
