const STATS = [
  { label: 'Total Jobs',     key: 'total',         color: '#0f172a', bar: '#64748b' },
  { label: 'Applied',        key: 'applied',       color: '#2563eb', bar: '#2563eb' },
  { label: 'Interviewing',   key: 'interviewing',  color: '#b45309', bar: '#f59e0b' },
  { label: 'Offers',         key: 'offer',         color: '#15803d', bar: '#22c55e' },
  { label: 'Rejected',       key: 'rejected',      color: '#b91c1c', bar: '#ef4444' },
]

export default function StatsBar({ jobs }) {
  const counts = {
    total:        jobs.length,
    applied:      jobs.filter((j) => j.status === 'Applied').length,
    interviewing: jobs.filter((j) => j.status === 'Interviewing').length,
    offer:        jobs.filter((j) => j.status === 'Offer').length,
    rejected:     jobs.filter((j) => j.status === 'Rejected').length,
  }

  return (
    <div className="stats-bar">
      {STATS.map(({ label, key, color, bar }) => (
        <div key={key} className="stat-card">
          <div className="stat-divider" style={{ backgroundColor: bar }} />
          <div className="stat-count" style={{ color }}>{counts[key]}</div>
          <div className="stat-label">{label}</div>
        </div>
      ))}
    </div>
  )
}
