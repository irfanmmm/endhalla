import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowUpRight, CalendarClock, Clock, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { useApi } from '../lib/useApi'
import { Alert, CardSkeleton, StatusBadge } from '../components/ui'
import { ChartTip, useChartTheme } from '../lib/chart'
import { dateTime, inr } from '../lib/format'
import type { Booking, DashboardOverview } from '../lib/types'

interface Activity {
  recentBookings: Booking[]
  recentUsers: { _id: string; name?: string; phone: string; userType: string }[]
}

function Stat({
  label,
  value,
  delta,
  tone = 'muted',
}: {
  label: string
  value: string | number
  delta: ReactNode
  tone?: 'up' | 'warn' | 'muted'
}) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      <div className={`delta ${tone}`}>{delta}</div>
    </div>
  )
}

export default function Dashboard() {
  const { data, loading, error } = useApi<DashboardOverview & { success: boolean }>('/dashboard/overview')
  const { data: activity } = useApi<Activity & { success: boolean }>('/dashboard/activity')
  const c = useChartTheme()

  if (loading) {
    return (
      <>
        <div className="stat-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} height={92} />
          ))}
        </div>
        <div className="grid-2">
          <CardSkeleton height={300} />
          <CardSkeleton height={300} />
        </div>
      </>
    )
  }
  if (error) return <Alert kind="error">{error}</Alert>
  if (!data) return null

  const s = data.stats

  return (
    <>
      <div className="stat-grid">
        <Stat
          label="Total users"
          value={s.totalUsers.toLocaleString()}
          tone="up"
          delta={
            <>
              <TrendingUp /> +{s.newUsers30d} in 30 days
            </>
          }
        />
        <Stat
          label="Counsellors"
          value={s.totalCounsellors}
          tone={s.pendingCounsellors ? 'warn' : 'muted'}
          delta={
            s.pendingCounsellors ? (
              <>
                <Clock /> {s.pendingCounsellors} pending review
              </>
            ) : (
              <>{s.verifiedCounsellors} verified</>
            )
          }
        />
        <Stat
          label="Bookings"
          value={s.totalBookings.toLocaleString()}
          delta={
            <>
              <CalendarClock /> {s.confirmedBookings} upcoming
            </>
          }
        />
        <Stat
          label="Revenue · 30 days"
          value={s.revenue30dText}
          tone="up"
          delta={<>{s.grossRevenueText} all time</>}
        />
      </div>

      <div className="grid-2">
        <div className="card card-pad">
          <div className="panel-title">Bookings · last 14 days</div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.timeseries} margin={{ left: -20, right: 6, top: 6, bottom: 0 }}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.accent} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={c.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={c.grid} vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => d.slice(5)}
                fontSize={11}
                stroke={c.axis}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={11}
                stroke={c.axis}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                domain={[0, (max: number) => Math.max(4, max)]}
                width={34}
              />
              <Tooltip content={<ChartTip />} cursor={{ stroke: c.grid }} />
              <Area type="monotone" dataKey="bookings" stroke={c.accent} strokeWidth={2} fill="url(#fill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card card-pad">
          <div className="panel-title">Revenue · last 14 days</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.timeseries} margin={{ left: -14, right: 6, top: 6, bottom: 0 }}>
              <CartesianGrid stroke={c.grid} vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => d.slice(5)}
                fontSize={11}
                stroke={c.axis}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={11}
                stroke={c.axis}
                tickLine={false}
                axisLine={false}
                width={44}
                domain={[0, (max: number) => Math.max(100, max)]}
                tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
              />
              <Tooltip content={<ChartTip format={(v) => inr(v)} />} cursor={{ fill: c.grid }} />
              <Bar dataKey="revenue" fill={c.accent} radius={[3, 3, 0, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-head">
            <span>Recent bookings</span>
            <Link to="/bookings" className="btn ghost sm">
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Counsellor</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {(activity?.recentBookings || []).map((b) => (
                  <tr key={b._id}>
                    <td>{b.clientName || b.clientPhone || 'Anonymous'}</td>
                    <td>{b.counsellorName}</td>
                    <td className="muted">{b.sessionType}</td>
                    <td>{inr(b.price)}</td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="muted">{dateTime(b.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <span>New sign-ups</span>
            <Link to="/users" className="btn ghost sm">
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          <div style={{ padding: '4px 0' }}>
            {(activity?.recentUsers || []).slice(0, 7).map((u) => (
              <Link
                key={u._id}
                to={`/users/${u._id}`}
                className="kv"
                style={{ padding: '9px 18px', margin: 0 }}
              >
                <span className="k">{u.name || 'Unnamed'}</span>
                <span className="v" style={{ fontWeight: 400 }}>
                  <span className="mono">{u.phone}</span> · {u.userType}
                </span>
              </Link>
            ))}
            {!activity?.recentUsers?.length && (
              <div className="muted" style={{ padding: '18px' }}>
                No recent sign-ups
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-head">
          <span>Sessions by type</span>
        </div>
        <div style={{ padding: 18, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {Object.entries(data.breakdown.bySessionType).map(([type, count]) => {
            const total = Object.values(data.breakdown.bySessionType).reduce((a, b) => a + b, 0) || 1
            return (
              <div key={type} style={{ minWidth: 120 }}>
                <div className="muted" style={{ fontSize: 12 }}>
                  {type}
                </div>
                <div style={{ fontSize: 20, fontWeight: 600, margin: '3px 0' }}>{count}</div>
                <div
                  style={{
                    height: 4,
                    borderRadius: 3,
                    background: 'var(--surface-hover)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(count / total) * 100}%`,
                      height: '100%',
                      background: 'var(--accent)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
