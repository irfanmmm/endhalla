import { useCallback, useEffect, useState } from 'react'
import { api, apiError } from './api'

export function useApi<T>(url: string | null, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refetch = useCallback(() => {
    if (!url) return
    setLoading(true)
    setError('')
    api
      .get(url)
      .then((res) => setData(res.data))
      .catch((e) => setError(apiError(e)))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch, setData }
}
