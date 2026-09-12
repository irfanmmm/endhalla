import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import { useAuth } from './AuthContext'

interface PendingCtx {
  pending: number
  refresh: () => void
}

const Ctx = createContext<PendingCtx>({ pending: 0, refresh: () => {} })

export function PendingProvider({ children }: { children: ReactNode }) {
  const { admin } = useAuth()
  const [pending, setPending] = useState(0)

  const refresh = useCallback(() => {
    if (!admin) return
    api
      .get('/counsellors/pending/count')
      .then((res) => setPending(res.data.count ?? 0))
      .catch(() => {})
  }, [admin])

  useEffect(() => {
    refresh()
  }, [refresh])

  return <Ctx.Provider value={{ pending, refresh }}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePending = () => useContext(Ctx)
