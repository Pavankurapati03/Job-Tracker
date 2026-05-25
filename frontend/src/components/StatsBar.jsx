const STATS = [
  { label: 'Total Applied', key: 'total', color: '#60a5fa', icon: '📋' },
  { label: 'Interviewing', key: 'interviewing', color: '#fbbf24', icon: '🎯' },
  { label: 'Offers', key: 'offer', color: '#34d399', icon: '🎉' },
  { label: 'Rejected', key: 'rejected', color: '#f87171', icon: '❌' },
]

export default function StatsBar({ jobs }) {
  const counts = {
    total: jobs.length,
    interviewing: jobs.filter((j) => j.status === 'Interviewing').length,
    offer: jobs.filter((j) => j.status === 'Offer').length,
    rejected: jobs.filter((j) => j.status === 'Rejected').length,
  }

  return (
    <div className="stats-bar">
      {STATS.map(({ label, key, color, icon }) => (
        <div key={key} className="stat-card">
          <div className="stat-icon">{icon}</div>
          <div className="stat-count" style={{ color }}>{counts[key]}</div>
          <div className="stat-label">{label}</div>
        </div>
      ))}
    </div>
  )
}
