import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useApi } from '../lib/useApi'
import { Alert, Badge, Empty, Pagination, TableSkeleton } from '../components/ui'
import { ReviewButtons } from '../components/ReviewActions'
import { date, initials, inr } from '../lib/format'
import type { Counsellor, PageMeta } from '../lib/types'

interface ListResp {
  data: Counsellor[]
  meta: PageMeta
  pendingCount: number
}

const STATUS_BADGE: Record<string, 'green' | 'amber' | 'red' | 'gray'> = {
  approved: 'green',
  pending: 'amber',
  rejected: 'red',
}

export default function Counsellors() {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [page, setPage] = useState(1)
  const [reload, setReload] = useState(0)

  const params = new URLSearchParams({ page: String(page), limit: '20' })
  if (q) params.set('q', q)
  if (status) params.set('status', status)
  if (sortBy) params.set('sortBy', sortBy)
  params.set('_r', String(reload))

  const { data, loading, error } = useApi<ListResp>(`/counsellors?${params}`, [page, q, status, sortBy, reload])

  return (
    <>
      <div className="page-head">
        <div>
          <h2>All counsellors</h2>
          <div className="sub">
            {data
              ? `${data.meta.total} total${data.pendingCount ? ` · ${data.pendingCount} awaiting review` : ''}`
              : 'Loading'}
          </div>
        </div>
      </div>

      <div className="toolbar">
        <div className="input-search">
          <Search />
          <input
            type="search"
            placeholder="Search name, phone, focus"
            value={q}
            onChange={(e) => {
              setPage(1)
              setQ(e.target.value)
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
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Newest first</option>
          <option value="name">Name A–Z</option>
          <option value="rating">Top rated</option>
          <option value="experience">Most experienced</option>
        </select>
      </div>

      {loading ? (
        <TableSkeleton cols={7} />
      ) : error ? (
        <Alert kind="error">{error}</Alert>
      ) : !data?.data.length ? (
        <Empty title="No counsellors match">Try clearing the filters.</Empty>
      ) : (
        <>
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Focus</th>
                  <th>Exp.</th>
                  <th>Rates chat / voice / video</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.data.map((c) => (
                  <tr key={c._id} className="clickable" onClick={() => nav(`/counsellors/${c._id}`)}>
                    <td>
                      <div className="cell-user">
                        <span className="avatar">{initials(c.fullName)}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 550 }} className="nowrap">
                            {c.fullName}
                          </div>
                          <div
                            className="muted nowrap"
                            style={{ fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
                          >
                            {c.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="mono">{c.phone}</td>
                    <td>
                      <div className="chips">
                        {(c.areasOfFocus || []).slice(0, 2).map((a) => (
                          <span key={a} className="chip">
                            {a}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{c.experienceYears ?? 0}y</td>
                    <td className="muted nowrap">
                      {inr(c.rates?.chat)} / {inr(c.rates?.voice)} / {inr(c.rates?.video)}
                    </td>
                    <td className="nowrap">{c.rating ? `★ ${c.rating}` : '—'}</td>
                    <td>
                      <Badge color={STATUS_BADGE[c.approvalStatus || 'pending']}>
                        {c.approvalStatus || 'pending'}
                      </Badge>
                    </td>
                    <td className="muted">{date(c.createdAt)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {c.approvalStatus === 'pending' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <ReviewButtons counsellor={c} onDone={() => setReload((n) => n + 1)} />
                        </div>
                      )}
                    </td>
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
