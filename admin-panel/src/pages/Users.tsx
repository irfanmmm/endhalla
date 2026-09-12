import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useApi } from '../lib/useApi'
import { Alert, Badge, Empty, Pagination, TableSkeleton } from '../components/ui'
import { date, initials } from '../lib/format'
import type { PageMeta, User } from '../lib/types'

interface ListResp {
  data: User[]
  meta: PageMeta
}

export default function Users() {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [userType, setUserType] = useState('')
  const [page, setPage] = useState(1)

  const params = new URLSearchParams({ page: String(page), limit: '20' })
  if (q) params.set('q', q)
  if (userType) params.set('userType', userType)

  const { data, loading, error } = useApi<ListResp>(`/users?${params}`, [page, q, userType])

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Users</h2>
          <div className="sub">{data ? `${data.meta.total} total` : 'Loading'}</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="input-search">
          <Search />
          <input
            type="search"
            placeholder="Search name or phone"
            value={q}
            onChange={(e) => {
              setPage(1)
              setQ(e.target.value)
            }}
          />
        </div>
        <select
          value={userType}
          onChange={(e) => {
            setPage(1)
            setUserType(e.target.value)
          }}
        >
          <option value="">All types</option>
          <option value="client">Clients</option>
          <option value="counsellor">Counsellors</option>
        </select>
      </div>

      {loading ? (
        <TableSkeleton cols={5} />
      ) : error ? (
        <Alert kind="error">{error}</Alert>
      ) : !data?.data.length ? (
        <Empty title="No users match">Try a different search or filter.</Empty>
      ) : (
        <>
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Type</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((u) => (
                  <tr key={u._id} className="clickable" onClick={() => nav(`/users/${u._id}`)}>
                    <td>
                      <div className="cell-user">
                        <span className="avatar">{initials(u.name || u.phone)}</span>
                        <span style={{ fontWeight: 550 }}>{u.name || 'Unnamed'}</span>
                      </div>
                    </td>
                    <td className="mono">{u.phone}</td>
                    <td className="muted">{u.gender || '—'}</td>
                    <td>
                      <Badge color={u.userType === 'counsellor' ? 'teal' : 'gray'}>{u.userType}</Badge>
                    </td>
                    <td className="muted">{date(u.createdAt)}</td>
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
