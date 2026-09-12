import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { api, apiError } from '../lib/api'
import { LoadingBlock, KV, Modal, StatusBadge } from '../components/ui'
import { ReviewButtons } from '../components/ReviewActions'
import { useToast } from '../context/ToastContext'
import { date, dateTime, inr } from '../lib/format'
import type { Booking, Counsellor } from '../lib/types'

type Form = Partial<Counsellor> & { rates: { chat?: number; voice?: number; video?: number } }

const csv = (arr?: string[]) => (arr || []).join(', ')
const parseCsv = (s: string) =>
  s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)

const BANNER_TEXT: Record<string, { title: string; body: string }> = {
  pending: {
    title: 'Awaiting review',
    body: 'This counsellor is hidden from the client app until approved.',
  },
  approved: {
    title: 'Approved',
    body: 'Listed on the client app.',
  },
  rejected: {
    title: 'Rejected',
    body: 'Hidden from the client app.',
  },
}

export default function CounsellorDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { toast } = useToast()

  const [counsellor, setCounsellor] = useState<Counsellor | null>(null)
  const [form, setForm] = useState<Form>({ rates: {} })
  const [summary, setSummary] = useState<{
    bookingSummary?: Record<string, number>
    recentBookings?: Booking[]
  }>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const hydrate = (c: Counsellor) => {
    setCounsellor(c)
    setForm({ ...c, rates: { chat: 499, voice: 799, video: 1199, ...(c.rates || {}) } })
  }

  useEffect(() => {
    setLoading(true)
    api
      .get(`/counsellors/${id}`)
      .then((res) => {
        hydrate(res.data.data as Counsellor)
        setSummary({ bookingSummary: res.data.bookingSummary, recentBookings: res.data.recentBookings })
      })
      .catch((e) => toast(apiError(e), 'error'))
      .finally(() => setLoading(false))
  }, [id, toast])

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put(`/counsellors/${id}`, form)
      hydrate(res.data.data)
      toast('Changes saved')
    } catch (e2) {
      toast(apiError(e2), 'error')
    } finally {
      setSaving(false)
    }
  }

  const del = async () => {
    try {
      await api.delete(`/counsellors/${id}`)
      toast('Counsellor deleted')
      nav('/counsellors', { replace: true })
    } catch (e) {
      toast(apiError(e), 'error')
      setConfirmDelete(false)
    }
  }

  if (loading || !counsellor) return <LoadingBlock />

  const bs = summary.bookingSummary
  const st = counsellor.approvalStatus || 'pending'
  const banner = BANNER_TEXT[st]

  return (
    <form onSubmit={save}>
      <div className="page-head">
        <div>
          <button type="button" className="btn ghost sm" onClick={() => nav('/counsellors')}>
            <ArrowLeft /> Counsellors
          </button>
          <h2 style={{ marginTop: 6 }}>{counsellor.fullName}</h2>
        </div>
        <button type="button" className="btn danger" onClick={() => setConfirmDelete(true)}>
          <Trash2 /> Delete
        </button>
      </div>

      <div className={`status-banner ${st}`}>
        <div>
          <div className="bt">{banner.title}</div>
          <div className="muted">
            {banner.body}
            {st === 'rejected' && counsellor.rejectionReason ? ` — “${counsellor.rejectionReason}”` : ''}
            {counsellor.reviewedAt ? ` · reviewed ${date(counsellor.reviewedAt)}` : ''}
          </div>
        </div>
        <div className="actions">
          <ReviewButtons counsellor={counsellor} size="md" onDone={hydrate} />
        </div>
      </div>

      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {bs && (
            <div className="card card-pad">
              <div className="panel-title">Bookings</div>
              <KV k="Total" v={bs.total} />
              <KV k="Completed" v={bs.completed} />
              <KV k="Upcoming" v={bs.confirmed} />
              <KV k="Cancelled" v={bs.cancelled} />
              <KV k="Earnings" v={inr(bs.earnings)} />
            </div>
          )}
          <div className="card card-pad">
            <div className="panel-title">Details</div>
            <KV k="Onboarding" v={counsellor.isOnboardingComplete ? 'Complete' : 'In progress'} />
            <KV k="Registered" v={date(counsellor.createdAt)} />
            <label className="check-row" style={{ marginTop: 4 }}>
              <span>Free session offer</span>
              <input
                type="checkbox"
                checked={!!form.hasFreeSessionOffer}
                onChange={(e) => set('hasFreeSessionOffer', e.target.checked)}
              />
            </label>
          </div>
        </div>

        <div className="card card-pad">
          <div className="field-row">
            <div className="field">
              <label>Full name</label>
              <input value={form.fullName || ''} onChange={(e) => set('fullName', e.target.value)} required />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} required />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Gender</label>
              <select value={form.gender || ''} onChange={(e) => set('gender', e.target.value)}>
                <option value="">Not set</option>
                <option>Male</option>
                <option>Female</option>
                <option>Non-Binary</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field">
              <label>Experience (years)</label>
              <input
                type="number"
                value={form.experienceYears ?? 0}
                onChange={(e) => set('experienceYears', Number(e.target.value))}
              />
            </div>
          </div>
          <div className="field">
            <label>Title</label>
            <input value={form.title || ''} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div className="field">
            <label>Avatar URL</label>
            <input value={form.avatar || ''} onChange={(e) => set('avatar', e.target.value)} />
          </div>
          <div className="field">
            <label>Bio</label>
            <textarea rows={3} value={form.bio || ''} onChange={(e) => set('bio', e.target.value)} />
          </div>
          <div className="field">
            <label>Areas of focus (comma separated)</label>
            <input value={csv(form.areasOfFocus)} onChange={(e) => set('areasOfFocus', parseCsv(e.target.value))} />
          </div>
          <div className="field">
            <label>Languages (comma separated)</label>
            <input value={csv(form.languages)} onChange={(e) => set('languages', parseCsv(e.target.value))} />
          </div>
          <div className="field">
            <label>Available slots (comma separated)</label>
            <input
              value={csv(form.availableSlots)}
              onChange={(e) => set('availableSlots', parseCsv(e.target.value))}
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Chat rate</label>
              <input
                type="number"
                value={form.rates.chat ?? 0}
                onChange={(e) => set('rates', { ...form.rates, chat: Number(e.target.value) })}
              />
            </div>
            <div className="field">
              <label>Voice rate</label>
              <input
                type="number"
                value={form.rates.voice ?? 0}
                onChange={(e) => set('rates', { ...form.rates, voice: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Video rate</label>
              <input
                type="number"
                value={form.rates.video ?? 0}
                onChange={(e) => set('rates', { ...form.rates, video: Number(e.target.value) })}
              />
            </div>
            <div className="field">
              <label>Free session text</label>
              <input
                value={form.freeSessionDurationText || ''}
                onChange={(e) => set('freeSessionDurationText', e.target.value)}
              />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Rating</label>
              <input
                type="number"
                step="0.1"
                value={form.rating ?? 0}
                onChange={(e) => set('rating', Number(e.target.value))}
              />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Review count</label>
              <input
                type="number"
                value={form.reviewCount ?? 0}
                onChange={(e) => set('reviewCount', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      {!!summary.recentBookings?.length && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-head">
            <span>Recent bookings</span>
          </div>
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Slot</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentBookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.clientName || b.clientPhone}</td>
                    <td>{b.sessionType}</td>
                    <td className="muted">
                      {b.dateText} · {b.timeText}
                    </td>
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
      )}

      <div className="action-bar">
        <button type="button" className="btn" onClick={() => nav('/counsellors')}>
          Cancel
        </button>
        <button className="btn primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {confirmDelete && (
        <Modal
          title="Delete counsellor?"
          onClose={() => setConfirmDelete(false)}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
              <button type="button" className="btn danger" onClick={del}>
                Delete
              </button>
            </>
          }
        >
          This permanently removes {counsellor.fullName}&rsquo;s counsellor profile. Their bookings stay intact.
        </Modal>
      )}
    </form>
  )
}
