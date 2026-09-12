import { useState } from 'react'
import { api, apiError } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { KV } from '../components/ui'
import { dateTime } from '../lib/format'

export default function Settings() {
  const { admin } = useAuth()
  const { toast } = useToast()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (next.length < 8) return setErr('New password must be at least 8 characters')
    if (next !== confirm) return setErr('Passwords do not match')
    setBusy(true)
    try {
      await api.put('/auth/password', { currentPassword: current, newPassword: next })
      toast('Password updated')
      setCurrent('')
      setNext('')
      setConfirm('')
    } catch (e2) {
      setErr(apiError(e2))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Settings</h2>
          <div className="sub">Your admin account</div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="card card-pad">
          <div className="panel-title">Account</div>
          <KV k="Name" v={admin?.name} />
          <KV k="Email" v={admin?.email} />
          <KV k="Role" v={admin?.role} />
          <KV k="Last login" v={dateTime(admin?.lastLoginAt)} />
        </div>

        <form className="card card-pad" onSubmit={submit}>
          <div className="panel-title">Change password</div>
          {err && <div className="alert error">{err}</div>}
          <div className="field">
            <label>Current password</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
          </div>
          <div className="field">
            <label>New password</label>
            <input type="password" value={next} onChange={(e) => setNext(e.target.value)} required />
          </div>
          <div className="field">
            <label>Confirm new password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
          <button className="btn primary" disabled={busy}>
            {busy ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </>
  )
}
