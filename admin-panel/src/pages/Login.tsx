import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiError } from '../lib/api'
import { Alert, Spinner } from '../components/ui'

export default function Login() {
  const { admin, login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  if (admin) return <Navigate to="/" replace />

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      await login(email.trim(), password)
      nav('/', { replace: true })
    } catch (e2) {
      setErr(apiError(e2, 'Login failed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="logo">E</div>
        <h2 style={{ fontSize: 18 }}>Sign in to Endhalla</h2>
        <p className="muted" style={{ marginTop: 4, marginBottom: 22, fontSize: 13 }}>
          Admin control panel
        </p>
        {err && <Alert kind="error">{err}</Alert>}
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            autoComplete="username"
            placeholder="admin@endhalla.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn primary" style={{ width: '100%' }} disabled={busy}>
          {busy ? <Spinner /> : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
