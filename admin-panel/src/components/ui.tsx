import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Inbox, X } from 'lucide-react'

export function Spinner() {
  return <span className="spinner" />
}

export function LoadingBlock() {
  return (
    <div className="loading-full">
      <Spinner />
    </div>
  )
}

export function Alert({ kind, children }: { kind: 'error' | 'success'; children: ReactNode }) {
  return <div className={`alert ${kind}`}>{children}</div>
}

export function Empty({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <Inbox />
      <div className="title">{title || 'Nothing here yet'}</div>
      {children && <div>{children}</div>}
    </div>
  )
}

type BadgeColor = 'green' | 'red' | 'amber' | 'teal' | 'blue' | 'gray'

export function Badge({ color, children }: { color: BadgeColor; children: ReactNode }) {
  return <span className={`badge ${color}`}>{children}</span>
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeColor> = {
    confirmed: 'blue',
    completed: 'green',
    cancelled: 'red',
    pending: 'amber',
    failed: 'red',
    free: 'gray',
  }
  return <Badge color={map[status] || 'gray'}>{status}</Badge>
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="table-wrap">
      <table className="tbl">
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c}>
                  <div className="skel" style={{ height: 14, width: c === 0 ? '70%' : '45%' }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function CardSkeleton({ height = 240 }: { height?: number }) {
  return <div className="skel" style={{ height, borderRadius: 12 }} />
}

export function Pagination({
  meta,
  onPage,
}: {
  meta: { page: number; totalPages: number; total: number }
  onPage: (p: number) => void
}) {
  return (
    <div className="pagination">
      <span>
        {meta.total.toLocaleString()} record{meta.total === 1 ? '' : 's'} · page {meta.page} of {meta.totalPages}
      </span>
      <button className="btn sm" disabled={meta.page <= 1} onClick={() => onPage(meta.page - 1)}>
        <ChevronLeft />
      </button>
      <button className="btn sm" disabled={meta.page >= meta.totalPages} onClick={() => onPage(meta.page + 1)}>
        <ChevronRight />
      </button>
    </div>
  )
}

export function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span>{title}</span>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

export function KV({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="kv">
      <span className="k">{k}</span>
      <span className="v">{v ?? '—'}</span>
    </div>
  )
}
