import JobCard from './JobCard'

export default function JobList({ jobs, onEdit, onDelete }) {
  if (jobs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📂</div>
        <h3>No jobs tracked yet</h3>
        <p>Click <strong>"Add Job"</strong> to log your first application.</p>
      </div>
    )
  }

  return (
    <div className="job-grid">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
