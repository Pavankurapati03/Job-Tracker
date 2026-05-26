import StatusBadge from './StatusBadge'

const FIELD = ({ label, value }) => {
  if (!value) return null
  return (
    <div className="detail-field">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  )
}

function formatDT(dt) {
  if (!dt) return null
  return new Date(dt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function JobDetails({ job, onClose, onEdit, onDeleteEvent }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--details" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <div>
            <h2>{job.role}</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>{job.company}</p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="details-body">
          {/* Status row */}
          <div className="details-badges">
            <StatusBadge status={job.status} />
            {job.priority && (
              <span className={`priority-chip priority-chip--${job.priority.toLowerCase()}`}>
                {job.priority} Priority
              </span>
            )}
            {job.job_type && <span className="chip chip--gray">{job.job_type}</span>}
            {job.work_mode && <span className="chip chip--gray">{job.work_mode}</span>}
          </div>

          <div className="details-grid">
            <FIELD label="Location"       value={job.location} />
            <FIELD label="Salary / CTC"   value={job.salary} />
            <FIELD label="Applied On"     value={job.applied_date} />
            <FIELD label="Interview"      value={formatDT(job.interview_datetime)} />
            {job.job_url && (
              <div className="detail-field detail-field--full">
                <span className="detail-label">Job Posting</span>
                <a href={job.job_url} target="_blank" rel="noreferrer" className="detail-link">
                  {job.job_url.length > 50 ? job.job_url.slice(0, 50) + '…' : job.job_url}
                </a>
              </div>
            )}
            {job.notes && (
              <div className="detail-field detail-field--full">
                <span className="detail-label">Notes</span>
                <p className="detail-notes">{job.notes}</p>
              </div>
            )}

            {/* Custom Events Timeline */}
            {job.events && job.events.length > 0 && (
              <div className="detail-field detail-field--full" style={{ marginTop: '8px' }}>
                <span className="detail-label">Scheduled Events</span>
                <div className="details-events-list" style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {job.events.map(evt => {
                    let badgeClass = ''
                    if (evt.type === 'Interview') badgeClass = 'event-interview'
                    else if (evt.type === 'Assessment') badgeClass = 'event-assessment'
                    else if (evt.type === 'Follow Up') badgeClass = 'event-followup'

                    return (
                      <div key={evt.id} className={`details-event-item ${badgeClass}`} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '0.85rem'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: '700' }}>{evt.type}</span>
                            <span style={{ fontSize: '0.78rem', opacity: 0.8 }}>
                              📅 {evt.date} {evt.time ? `at ${evt.time}` : ''}
                            </span>
                          </div>
                          {evt.note && (
                            <p style={{ marginTop: '4px', fontSize: '0.8rem', opacity: 0.9, lineHeight: 1.4, wordBreak: 'break-word' }}>
                              {evt.note}
                            </p>
                          )}
                        </div>
                        {onDeleteEvent && (
                          <button 
                            type="button" 
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'inherit',
                              opacity: 0.6,
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '1.2rem',
                              padding: '0 4px',
                              lineHeight: 1,
                              marginLeft: '8px'
                            }}
                            onClick={() => onDeleteEvent(job.id, evt.id)}
                            title="Delete event"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="details-actions">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button
            id={`details-edit-btn`}
            className="btn btn-primary"
            onClick={() => { onClose(); onEdit(job) }}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}
