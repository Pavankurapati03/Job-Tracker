const STATUS_STYLES = {
  Applied:      { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  Interviewing: { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  Offer:        { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  Rejected:     { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES['Applied']
  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  )
}
