import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Trash2 } from 'lucide-react'
import { api, apiError } from '../lib/api'
import { Alert, Badge, KV, LoadingBlock, Modal, StatusBadge } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { date, dateTime, inr } from '../lib/format'
import type { Booking, Counsellor, User } from '../lib/types'

export default function UserDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { toast } = useToast()

  const [user, setUser] = useState<User | null>(null)
  const [counsellorProfile, setCP] = useState<Counsellor | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [sum, setSum] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .get(`/users/${id}`)
      .then((res) => {
        setUser(res.data.data)
        setCP(res.data.counsellorProfile)
        setBookings(res.data.bookings || [])
        setSum(res.data.bookingSummary || {})
        setName(res.data.data.name || '')
        setGender(res.data.data.gender || '')
      })
      .catch((e) => setErr(apiError(e)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put(`/users/${id}`, { name, gender })
      toast('Changes saved')
      load()
    } catch (e2) {
      toast(apiError(e2), 'error')
    } finally {
      setSaving(false)
    }
  }

  const del = async () => {
    try {
      await api.delete(`/users/${id}`)
      toast('User deleted')
      nav('/users', { replace: true })
    } catch (e) {
      toast(apiError(e), 'error')
      setConfirmDelete(false)
    }
  }

  if (loading) return <LoadingBlock />
  if (!user) return <Alert kind="error">{err || 'User not found'}</Alert>

  return (
    <>
      <div className="page-head">
        <div>
          <button className="btn ghost sm" onClick={() => nav('/users')}>
            <ArrowLeft /> Users
          </button>
          <h2 style={{ marginTop: 6 }}>{user.name || user.phone}</h2>
        </div>
        <button className="btn danger" onClick={() => setConfirmDelete(true)}>
          <Trash2 /> Delete user
        </button>
      </div>

      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card-pad">
            <div className="cell-user" style={{ marginBottom: 12 }}>
              <span className="avatar lg">{user.name?.[0] || user.phone[0]}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{user.name || 'Unnamed'}</div>
                <Badge color={user.userType === 'counsellor' ? 'teal' : 'gray'}>{user.userType}</Badge>
              </div>
            </div>
            <KV k="Phone" v={<span className="mono">{user.phone}</span>} />
            <KV k="Joined" v={date(user.createdAt)} />
          </div>

          <div className="card card-pad">
            <div className="panel-title">Booking activity</div>
            <KV k="Total" v={sum.total ?? 0} />
            <KV k="Completed" v={sum.completed ?? 0} />
            <KV k="Cancelled" v={sum.cancelled ?? 0} />
            <KV k="Total spend" v={inr(sum.spend)} />
          </div>

          {counsellorProfile && (
            <div className="card card-pad">
              <div className="panel-title">Counsellor profile</div>
              <KV k="Verified" v={counsellorProfile.isVerified ? 'Yes' : 'No'} />
              <button
                className="btn sm"
                style={{ marginTop: 10 }}
                onClick={() => nav(`/counsellors/${counsellorProfile._id}`)}
              >
                Open counsellor <ArrowUpRight size={13} />
              </button>
            </div>
          )}
        </div>

        <form className="card card-pad" onSubmit={save}>
          <div className="panel-title">Edit profile</div>
          <div className="field">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </div>
          <div className="field">
            <label>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Not set</option>
              <option>Male</option>
              <option>Female</option>
              <option>Non-Binary</option>
              <option>Prefer not to say</option>
              <option>Other</option>
            </select>
          </div>
          <button className="btn primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-head">
          <span>Bookings ({bookings.length})</span>
        </div>
        {bookings.length ? (
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Counsellor</th>
                  <th>Type</th>
                  <th>Slot</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.counsellorName}</td>
                    <td>{b.sessionType}</td>
                    <td className="muted">
                      {b.dateText} · {b.timeText}
                    </td>
                    <td>{inr(b.price)}</td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td>
                      <StatusBadge status={b.paymentStatus} />
                    </td>
                    <td className="muted">{dateTime(b.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="muted" style={{ padding: 20 }}>
            No bookings yet.
          </div>
        )}
      </div>

      {confirmDelete && (
        <Modal
          title="Delete user?"
          onClose={() => setConfirmDelete(false)}
          footer={
            <>
              <button className="btn" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
              <button className="btn danger" onClick={del}>
                Delete
              </button>
            </>
          }
        >
          This permanently deletes {user.name || user.phone}
          {user.userType === 'counsellor' ? ' and their counsellor profile' : ''}. Bookings are kept.
        </Modal>
      )}
    </>
  )
}
