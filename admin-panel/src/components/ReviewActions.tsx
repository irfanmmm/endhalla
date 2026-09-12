import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { api, apiError } from '../lib/api'
import { useToast } from '../context/ToastContext'
import { usePending } from '../context/PendingContext'
import { Modal } from './ui'
import type { Counsellor } from '../lib/types'

type Decision = 'approved' | 'rejected' | 'pending'

export function useReview(onDone?: (c: Counsellor) => void) {
  const { toast } = useToast()
  const { refresh } = usePending()
  const [busy, setBusy] = useState(false)

  const review = async (id: string, decision: Decision, reason?: string) => {
    setBusy(true)
    try {
      const res = await api.patch(`/counsellors/${id}/approval`, { decision, reason })
      toast(res.data.message)
      refresh()
      onDone?.(res.data.data)
    } catch (e) {
      toast(apiError(e), 'error')
    } finally {
      setBusy(false)
    }
  }

  return { review, busy }
}

export function ReviewButtons({
  counsellor,
  size = 'sm',
  onDone,
}: {
  counsellor: Counsellor
  size?: 'sm' | 'md'
  onDone?: (c: Counsellor) => void
}) {
  const { review, busy } = useReview(onDone)
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const cls = size === 'sm' ? 'btn sm' : 'btn'

  return (
    <>
      {counsellor.approvalStatus !== 'approved' && (
        <button className={`${cls} primary`} disabled={busy} onClick={() => review(counsellor._id, 'approved')}>
          <Check /> Approve
        </button>
      )}
      {counsellor.approvalStatus !== 'rejected' && (
        <button className={`${cls} danger`} disabled={busy} onClick={() => setRejecting(true)}>
          <X /> Reject
        </button>
      )}

      {rejecting && (
        <Modal
          title={`Reject ${counsellor.fullName}?`}
          onClose={() => setRejecting(false)}
          footer={
            <>
              <button className="btn" onClick={() => setRejecting(false)}>
                Cancel
              </button>
              <button
                className="btn danger"
                disabled={busy}
                onClick={async () => {
                  await review(counsellor._id, 'rejected', reason)
                  setRejecting(false)
                  setReason('')
                }}
              >
                Reject counsellor
              </button>
            </>
          }
        >
          <p className="muted" style={{ marginTop: 0 }}>
            They won&rsquo;t appear on the client app. You can approve them later.
          </p>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Reason (optional, shown internally)</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Missing licence document"
            />
          </div>
        </Modal>
      )}
    </>
  )
}
