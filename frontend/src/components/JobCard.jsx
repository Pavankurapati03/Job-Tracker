import StatusBadge from './StatusBadge'

const PRIORITY_COLORS = {
  High:   { color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
  Medium: { color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  Low:    { color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
}

function formatDT(dt) {
  if (!dt) return null
  return new Date(dt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function JobCard({ job, onEdit, onDelete, onPin, onView }) {
  const priority = job.priority ? PRIORITY_COLORS[job.priority] : null

  return (
    <div className={`job-card ${job.pinned ? 'job-card--pinned' : ''}`}>

      {/* Top row: title + badges */}
      <div className="job-card-header">
        <div className="job-card-title">
          <h3 className="job-role">
            {job.role} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>— {job.company}</span>
          </h3>
        </div>
        <div className="job-card-top-actions">
          <button
            id={`pin-job-${job.id}`}
            className={`btn-pin ${job.pinned ? 'btn-pin--active' : ''}`}
            onClick={() => onPin(job)}
            title={job.pinned ? 'Unpin' : 'Pin'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24"
              fill={job.pinned ? 'currentColor' : 'none'}
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="17" x2="12" y2="22"/>
              <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
            </svg>
          </button>
          <StatusBadge status={job.status} />
        </div>
      </div>

      {/* Priority */}
      {priority && (
        <div style={{ display: 'flex' }}>
          <span style={{
            fontSize: '0.72rem', fontWeight: 600,
            padding: '2px 10px', borderRadius: '999px',
            backgroundColor: priority.bg,
            color: priority.color,
            border: `1px solid ${priority.border}`,
          }}>
            {job.priority} Priority
          </span>
        </div>
      )}

      {/* Dates */}
      <div className="card-dates">
        <div className="card-date-row">
          <span className="date-label">Applied</span>
          <span className="date-value">{job.applied_date}</span>
        </div>
        {job.interview_datetime && (
          <div className="card-date-row interview-row">
            <span className="date-label">Interview</span>
            <span className="date-value">{formatDT(job.interview_datetime)}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="job-card-actions">
        <button
          id={`view-job-${job.id}`}
          className="btn btn-secondary"
          onClick={() => onView(job)}
        >
          Details
        </button>
        <button
          id={`edit-job-${job.id}`}
          className="btn btn-secondary"
          onClick={() => onEdit(job)}
        >
          Edit
        </button>
        <button
          id={`delete-job-${job.id}`}
          className="btn btn-danger"
          onClick={() => onDelete(job.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
