import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { api, apiError } from '../lib/api'
import { useApi } from '../lib/useApi'
import { Alert, Empty, KV, Modal, Pagination, StatusBadge, TableSkeleton } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { dateTime, inr } from '../lib/format'
import type { Booking, PageMeta } from '../lib/types'

interface ListResp {
  data: Booking[]
  meta: PageMeta
  summary: { matchedRevenueText: string }
}

const STATUSES = ['confirmed', 'completed', 'cancelled']
const PAY_STATUSES = ['pending', 'completed', 'failed', 'free']

export default function Bookings() {
  const [sp, setSp] = useSearchParams()
  const { toast } = useToast()
  const [q, setQ] = useState(sp.get('q') || '')
  const [status, setStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [sessionType, setSessionType] = useState('')
  const [page, setPage] = useState(1)
  const [active, setActive] = useState<Booking | null>(null)

  const params = new URLSearchParams({ page: String(page), limit: '20' })
  if (q) params.set('q', q)
  if (status) params.set('status', status)
  if (paymentStatus) params.set('paymentStatus', paymentStatus)
  if (sessionType) params.set('sessionType', sessionType)

  const { data, loading, error, refetch } = useApi<ListResp>(`/bookings?${params}`, [
    page,
    q,
    status,
    paymentStatus,
    sessionType,
  ])

  const update = async (patch: Partial<Booking>) => {
    if (!active) return
    try {
      const res = await api.patch(`/bookings/${active._id}`, patch)
      setActive(res.data.data)
      toast('Booking updated')
      refetch()
    } catch (e) {
      toast(apiError(e), 'error')
    }
  }

  const remove = async () => {
    if (!active) return
    try {
      await api.delete(`/bookings/${active._id}`)
      toast('Booking deleted')
      setActive(null)
      refetch()
    } catch (e) {
      toast(apiError(e), 'error')
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Bookings</h2>
          <div className="sub">
            {data ? `${data.meta.total} total · ${data.summary.matchedRevenueText} matched revenue` : 'Loading'}
          </div>
        </div>
      </div>

      <div className="toolbar">
        <div className="input-search">
          <Search />
          <input
            type="search"
            placeholder="Client, counsellor, payment id"
            value={q}
            onChange={(e) => {
              setPage(1)
              setQ(e.target.value)
              const next = new URLSearchParams(sp)
              if (e.target.value) next.set('q', e.target.value)
              else next.delete('q')
              setSp(next, { replace: true })
            }}
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setPage(1)
            setStatus(e.target.value)
          }}
        >
          <option value="">Any status</option>
          {STATUSES.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          value={paymentStatus}
          onChange={(e) => {
            setPage(1)
            setPaymentStatus(e.target.value)
          }}
        >
          <option value="">Any payment</option>
          {PAY_STATUSES.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          value={sessionType}
          onChange={(e) => {
            setPage(1)
            setSessionType(e.target.value)
          }}
        >
          <option value="">Any type</option>
          <option>Chat</option>
          <option>Voice</option>
          <option>Video</option>
        </select>
      </div>

      {loading ? (
        <TableSkeleton cols={7} />
      ) : error ? (
        <Alert kind="error">{error}</Alert>
      ) : !data?.data.length ? (
        <Empty title="No bookings match">Adjust the filters above.</Empty>
      ) : (
        <>
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Client</th>
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
                {data.data.map((b) => (
                  <tr key={b._id} className="clickable" onClick={() => setActive(b)}>
                    <td>{b.clientName || b.clientPhone || 'Anonymous'}</td>
                    <td>{b.counsellorName}</td>
                    <td className="muted">{b.sessionType}</td>
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
          <Pagination meta={data.meta} onPage={setPage} />
        </>
      )}

      {active && (
        <Modal
          title="Booking detail"
          onClose={() => setActive(null)}
          footer={
            <button className="btn danger" onClick={remove}>
              Delete booking
            </button>
          }
        >
          <KV k="Client" v={`${active.clientName || 'Anonymous'} · ${active.clientPhone || '—'}`} />
          <KV k="Counsellor" v={active.counsellorName} />
          <KV k="Session" v={`${active.sessionType} · ${active.dateText} ${active.timeText}`} />
          <KV k="Price" v={inr(active.price)} />
          <KV k="Payment method" v={active.paymentMethod || '—'} />
          <KV k="Razorpay order" v={<span className="mono">{active.razorpayOrderId || '—'}</span>} />
          <KV k="Razorpay payment" v={<span className="mono">{active.razorpayPaymentId || '—'}</span>} />
          <KV k="Created" v={dateTime(active.createdAt)} />

          <div className="field" style={{ marginTop: 16 }}>
            <label>Status</label>
            <select value={active.status} onChange={(e) => update({ status: e.target.value as Booking['status'] })}>
              {STATUSES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Payment status</label>
            <select
              value={active.paymentStatus}
              onChange={(e) => update({ paymentStatus: e.target.value as Booking['paymentStatus'] })}
            >
              {PAY_STATUSES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Notes</label>
            <textarea
              rows={2}
              defaultValue={active.notes || ''}
              onBlur={(e) => e.target.value !== (active.notes || '') && update({ notes: e.target.value })}
            />
          </div>
        </Modal>
      )}
    </>
  )
}
