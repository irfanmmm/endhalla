import { useEffect, useState } from 'react'

export function useChartTheme() {
  const read = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

  const [dark, setDark] = useState(read)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const on = () => setDark(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  return {
    accent: dark ? '#18b487' : '#0f9d76',
    grid: dark ? 'rgba(255,255,255,0.08)' : 'rgba(18,22,23,0.08)',
    axis: dark ? '#7c8286' : '#8a9094',
  }
}

interface TipProps {
  active?: boolean
  payload?: { name: string; value: number; color?: string }[]
  label?: string
  format?: (v: number) => string
}

export function ChartTip({ active, payload, label, format }: TipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tip">
      <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ fontWeight: 550 }}>
          {format ? format(p.value) : p.value}
        </div>
      ))}
    </div>
  )
}
