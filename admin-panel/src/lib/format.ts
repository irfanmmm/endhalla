export const inr = (n: number | string | undefined | null): string => {
  const num = typeof n === 'string' ? parseFloat(n.replace(/[^0-9.]/g, '')) : n || 0
  return `₹${Number(num || 0).toLocaleString('en-IN')}`
}

export const date = (d?: string | Date): string => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const dateTime = (d?: string | Date): string => {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const initials = (name?: string): string =>
  (name || '?')
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
