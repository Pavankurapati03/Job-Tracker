import StatusBadge from './StatusBadge'

export default function JobCard({ job, onEdit, onDelete }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h3 className="job-role">{job.role}</h3>
          <p className="job-company">{job.company}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="job-meta">
        {job.location && (
          <span className="meta-item">📍 {job.location}</span>
        )}
        <span className="meta-item">📅 {job.applied_date}</span>
      </div>

      {job.notes && (
        <p className="job-notes">{job.notes}</p>
      )}

      <div className="job-card-actions">
        <button
          id={`edit-job-${job.id}`}
          className="btn btn-secondary"
          onClick={() => onEdit(job)}
        >
          ✏️ Edit
        </button>
        <button
          id={`delete-job-${job.id}`}
          className="btn btn-danger"
          onClick={() => onDelete(job.id)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  )
}
