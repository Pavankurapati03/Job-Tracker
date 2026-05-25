import { useState, useEffect } from 'react'
import StatsBar from './components/StatsBar'
import JobList from './components/JobList'
import JobForm from './components/JobForm'
import { getJobs, createJob, updateJob, deleteJob } from './api/jobsApi'
import './App.css'

export default function App() {
  const [jobs, setJobs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [error, setError] = useState(null)

  const fetchJobs = async () => {
    try {
      const res = await getJobs()
      setJobs(res.data)
      setError(null)
    } catch {
      setError('⚠️ Cannot connect to backend. Make sure FastAPI is running on port 8000.')
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleAdd = () => {
    setEditingJob(null)
    setShowForm(true)
  }

  const handleEdit = (job) => {
    setEditingJob(job)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingJob(null)
  }

  const handleSubmit = async (formData) => {
    if (editingJob) {
      await updateJob(editingJob.id, formData)
    } else {
      await createJob(formData)
    }
    await fetchJobs()
    handleClose()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job application?')) return
    await deleteJob(id)
    await fetchJobs()
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <div>
              <h1>Job Tracker</h1>
              <p className="header-sub">Track every application. Land your dream job.</p>
            </div>
          </div>
          <button id="add-job-btn" className="btn btn-primary" onClick={handleAdd}>
            + Add Job
          </button>
        </div>
      </header>

      <main className="app-main">
        {error && <div className="error-banner">{error}</div>}

        <StatsBar jobs={jobs} />

        <div className="section-header">
          <h2>Applications <span className="count-badge">{jobs.length}</span></h2>
        </div>

        <JobList jobs={jobs} onEdit={handleEdit} onDelete={handleDelete} />
      </main>

      {showForm && (
        <JobForm
          editingJob={editingJob}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
