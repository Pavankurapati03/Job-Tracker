const STATUS_STYLES = {
  Applied: { bg: '#1e3a5f', color: '#60a5fa', border: '#2563eb' },
  Interviewing: { bg: '#3b2d00', color: '#fbbf24', border: '#d97706' },
  Offer: { bg: '#0d3320', color: '#34d399', border: '#059669' },
  Rejected: { bg: '#3b0f0f', color: '#f87171', border: '#dc2626' },
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
        letterSpacing: '0.03em',
      }}
    >
      {status}
    </span>
  )
}
