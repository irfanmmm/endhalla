import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useApi } from '../lib/useApi'
import { Alert, Empty, TableSkeleton } from '../components/ui'
import { ReviewButtons } from '../components/ReviewActions'
import { date, initials, inr } from '../lib/format'
import type { Counsellor, PageMeta } from '../lib/types'

interface ListResp {
  data: Counsellor[]
  meta: PageMeta
}

export default function Approvals() {
  const [reload, setReload] = useState(0)
  const { data, loading, error } = useApi<ListResp>(
    `/counsellors?status=pending&limit=50&sortBy=name&_r=${reload}`,
    [reload],
  )

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Counsellor approvals</h2>
          <div className="sub">
            Counsellors register through the counsellor app. Approve to list them on the client app.
          </div>
        </div>
      </div>

      {loading ? (
        <TableSkeleton cols={5} />
      ) : error ? (
        <Alert kind="error">{error}</Alert>
      ) : !data?.data.length ? (
        <Empty title="Nothing to review">Every counsellor has been reviewed.</Empty>
      ) : (
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Focus</th>
                <th>Exp.</th>
                <th>Rates</th>
                <th>Registered</th>
                <th>Onboarding</th>
                <th style={{ textAlign: 'right' }}>Review</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div className="cell-user">
                      <span className="avatar">{initials(c.fullName)}</span>
                      <div style={{ minWidth: 0 }}>
                        <Link to={`/counsellors/${c._id}`} style={{ fontWeight: 550 }}>
                          {c.fullName} <ArrowUpRight size={12} style={{ verticalAlign: -1 }} />
                        </Link>
                        <div className="muted nowrap" style={{ fontSize: 12 }}>
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
                  <td className="muted nowrap">{inr(c.rates?.chat)} / {inr(c.rates?.voice)} / {inr(c.rates?.video)}</td>
                  <td className="muted">{date(c.createdAt)}</td>
                  <td>
                    {c.isOnboardingComplete ? (
                      <span className="badge green">Complete</span>
                    ) : (
                      <span className="badge amber">In progress</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <ReviewButtons counsellor={c} onDone={() => setReload((n) => n + 1)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
