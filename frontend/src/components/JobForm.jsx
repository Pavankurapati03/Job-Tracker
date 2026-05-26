import { useState, useEffect } from 'react'

const STATUSES   = ['Applied', 'Interviewing', 'Offer', 'Rejected']
const JOB_TYPES  = ['Full-time', 'Part-time', 'Internship', 'Contract']
const WORK_MODES = ['Remote', 'Hybrid', 'On-site']
const PRIORITIES = ['High', 'Medium', 'Low']

const EMPTY_FORM = {
  company:            '',
  role:               '',
  status:             'Applied',
  location:           '',
  notes:              '',
  applied_date:       new Date().toISOString().split('T')[0],
  salary:             '',
  job_type:           '',
  work_mode:          '',
  interview_date:     '',
  job_url:            '',
  priority:           '',
}

export default function JobForm({ editingJob, onSubmit, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingJob) {
      setForm({
        company:            editingJob.company            || '',
        role:               editingJob.role               || '',
        status:             editingJob.status             || 'Applied',
        location:           editingJob.location           || '',
        notes:              editingJob.notes              || '',
        applied_date:       editingJob.applied_date       || EMPTY_FORM.applied_date,
        salary:             editingJob.salary             || '',
        job_type:           editingJob.job_type           || '',
        work_mode:          editingJob.work_mode          || '',
        interview_date:     editingJob.interview_datetime
          ? editingJob.interview_datetime.slice(0, 10)
          : '',
        interview_time:     editingJob.interview_datetime
          ? editingJob.interview_datetime.slice(11, 16)
          : '',
        job_url:            editingJob.job_url            || '',
        priority:           editingJob.priority           || '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [editingJob])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    let interview_datetime = null
    if (form.interview_date) {
      interview_datetime = `${form.interview_date}T${form.interview_time || '00:00'}:00`
    }

    // eslint-disable-next-line no-unused-vars
    const { interview_date, interview_time, ...restForm } = form

    const payload = {
      ...restForm,
      salary:             form.salary             || null,
      job_type:           form.job_type           || null,
      work_mode:          form.work_mode          || null,
      interview_datetime: interview_datetime,
      job_url:            form.job_url            || null,
      priority:           form.priority           || null,
      location:           form.location           || null,
      notes:              form.notes              || null,
    }
    try {
      await onSubmit(payload)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
          <button id="close-modal-btn" className="modal-close" onClick={onClose}>×</button>
        </div>

        <form id="job-form" onSubmit={handleSubmit} className="job-form">

          {/* ── Section: Basic Info ── */}
          <div className="form-section-label">Basic Info</div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">Company *</label>
              <input id="company" name="company" value={form.company}
                onChange={handleChange} placeholder="e.g. Google" required />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <input id="role" name="role" value={form.role}
                onChange={handleChange} placeholder="e.g. Software Engineer" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
                <option value="">— Select —</option>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* ── Section: Role Details ── */}
          <div className="form-section-label">Role Details</div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="job_type">Job Type</label>
              <select id="job_type" name="job_type" value={form.job_type} onChange={handleChange}>
                <option value="">— Select —</option>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="work_mode">Work Mode</label>
              <select id="work_mode" name="work_mode" value={form.work_mode} onChange={handleChange}>
                <option value="">— Select —</option>
                {WORK_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salary">Salary / CTC</label>
              <input id="salary" name="salary" value={form.salary}
                onChange={handleChange} placeholder="e.g. 12 LPA, $80k" />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input id="location" name="location" value={form.location}
                onChange={handleChange} placeholder="e.g. Bangalore, Remote" />
            </div>
          </div>

          {/* ── Section: Tracking ── */}
          <div className="form-section-label">Tracking</div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="applied_date">Applied Date</label>
              <input id="applied_date" name="applied_date" type="date"
                value={form.applied_date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Interview Date &amp; Time</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input id="interview_date" name="interview_date" type="date"
                  value={form.interview_date} onChange={handleChange} style={{ flex: 1 }} />
                <input id="interview_time" name="interview_time" type="time"
                  value={form.interview_time} onChange={handleChange} style={{ flex: 1 }} />
              </div>
            </div>
          </div>



          <div className="form-group">
            <label htmlFor="job_url">Job Posting URL</label>
            <input id="job_url" name="job_url" type="url" value={form.job_url}
              onChange={handleChange} placeholder="https://careers.google.com/jobs/..." />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" value={form.notes}
              onChange={handleChange}
              placeholder="Recruiter name, referral, next steps..."
              rows={3} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button id="submit-job-btn" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editingJob ? 'Update Job' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
