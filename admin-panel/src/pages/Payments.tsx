import { useState } from 'react'
import { useApi } from '../lib/useApi'
import { Alert, Empty, Pagination, StatusBadge, TableSkeleton } from '../components/ui'
import { dateTime, inr } from '../lib/format'
import type { Booking, PageMeta } from '../lib/types'

interface ListResp {
  data: Booking[]
  meta: PageMeta
}

export default function Payments() {
  const [paymentStatus, setPaymentStatus] = useState('')
  const [page, setPage] = useState(1)

  const params = new URLSearchParams({ page: String(page), limit: '20' })
  if (paymentStatus) params.set('paymentStatus', paymentStatus)

  const { data, loading, error } = useApi<ListResp>(`/bookings/payments/list?${params}`, [page, paymentStatus])

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Payments</h2>
          <div className="sub">Bookings with a Razorpay order or a paid method</div>
        </div>
      </div>

      <div className="toolbar">
        <select
          value={paymentStatus}
          onChange={(e) => {
            setPage(1)
            setPaymentStatus(e.target.value)
          }}
        >
          <option value="">Any payment status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <TableSkeleton cols={8} />
      ) : error ? (
        <Alert kind="error">{error}</Alert>
      ) : !data?.data.length ? (
        <Empty title="No payment records yet">Paid bookings will appear here.</Empty>
      ) : (
        <>
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Counsellor</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Payment</th>
                  <th>Order ID</th>
                  <th>Payment ID</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((b) => (
                  <tr key={b._id}>
                    <td>{b.clientName || b.clientPhone || 'Anonymous'}</td>
                    <td>{b.counsellorName}</td>
                    <td>{inr(b.price)}</td>
                    <td className="muted">{b.paymentMethod || '—'}</td>
                    <td>
                      <StatusBadge status={b.paymentStatus} />
                    </td>
                    <td className="mono">{b.razorpayOrderId || '—'}</td>
                    <td className="mono">{b.razorpayPaymentId || '—'}</td>
                    <td className="muted">{dateTime(b.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination meta={data.meta} onPage={setPage} />
        </>
      )}
    </>
  )
}
