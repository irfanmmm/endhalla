import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Stethoscope,
  Users,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePending } from '../context/PendingContext'
import { initials } from '../lib/format'

const NAV = [
  { to: '/', label: 'Dashboard', Icon: LayoutDashboard, end: true, section: 'Overview' },
  { to: '/approvals', label: 'Approvals', Icon: BadgeCheck, section: 'Counsellors', badge: true },
  { to: '/counsellors', label: 'All counsellors', Icon: Stethoscope, section: 'Counsellors' },
  { to: '/users', label: 'Users', Icon: Users, section: 'People' },
  { to: '/bookings', label: 'Bookings', Icon: CalendarDays, section: 'People' },
  { to: '/payments', label: 'Payments', Icon: CreditCard, section: 'People' },
  { to: '/settings', label: 'Settings', Icon: Settings, section: 'Account' },
]

const TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/approvals': 'Counsellor approvals',
  '/counsellors': 'Counsellors',
  '/users': 'Users',
  '/bookings': 'Bookings',
  '/payments': 'Payments',
  '/settings': 'Settings',
}

function title(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname]
  if (pathname.startsWith('/counsellors')) return 'Counsellor'
  if (pathname.startsWith('/users')) return 'User'
  if (pathname.startsWith('/bookings')) return 'Booking'
  return 'Endhalla admin'
}

export default function Layout() {
  const { admin, logout } = useAuth()
  const { pending, refresh } = usePending()
  const { pathname } = useLocation()

  useEffect(() => {
    refresh()
  }, [pathname, refresh])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="logo">E</span>
          <span>Endhalla</span>
        </div>
        <nav>
          {NAV.map(({ to, label, Icon, end, section, badge }, i) => (
            <div key={to}>
              {NAV[i - 1]?.section !== section && <div className="nav-section">{section}</div>}
              <NavLink to={to} end={end} className="nav-link">
                <Icon />
                <span>{label}</span>
                {badge && pending > 0 && <span className="nav-badge">{pending}</span>}
              </NavLink>
            </div>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span className="avatar">{initials(admin?.name)}</span>
          <div className="meta">
            <div className="who">{admin?.name}</div>
            <div className="sub">{admin?.email}</div>
          </div>
          <button className="icon-btn" onClick={logout} aria-label="Sign out" title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <h1>{title(pathname)}</h1>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
