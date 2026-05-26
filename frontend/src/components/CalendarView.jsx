import { useState, useMemo } from 'react'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export default function CalendarView({ jobs, onView, onAddEvent }) {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleToday = () => {
    const now = new Date()
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1))
  }

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayIndex = new Date(year, month, 1).getDay()
    
    const days = []
    
    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate()
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      })
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      })
    }
    
    // Next month padding (make it a clean 35 or 42 grid)
    const remainingSlots = (days.length % 7 === 0) ? 0 : 7 - (days.length % 7)
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      })
    }
    
    return days
  }, [year, month])

  // Helper to format date string to local "YYYY-MM-DD" for comparison
  const toISODate = (dateObj) => {
    const y = dateObj.getFullYear()
    const m = String(dateObj.getMonth() + 1).padStart(2, '0')
    const d = String(dateObj.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const todayStr = toISODate(new Date())

  // Extract and flat-map all events from all jobs
  const calendarEvents = useMemo(() => {
    const list = []
    jobs.forEach(job => {
      // 1. Add explicitly tracked custom events
      if (job.events && Array.isArray(job.events)) {
        job.events.forEach(evt => {
          list.push({
            ...evt,
            jobId: job.id,
            company: job.company,
            role: job.role,
            job: job
          })
        })
      }
      
      // 2. Fallback check for interview_datetime (if not already represented in events)
      if (job.interview_datetime) {
        const interviewDateStr = job.interview_datetime.slice(0, 10)
        const alreadyInEvents = job.events && job.events.some(
          e => e.type === 'Interview' && e.date === interviewDateStr
        )
        if (!alreadyInEvents) {
          list.push({
            id: `legacy-interview-${job.id}`,
            type: 'Interview',
            date: interviewDateStr,
            time: job.interview_datetime.slice(11, 16),
            note: 'Initial Interview scheduled from application form',
            jobId: job.id,
            company: job.company,
            role: job.role,
            job: job
          })
        }
      }
    })
    return list
  }, [jobs])

  return (
    <div className="calendar-view-page">
      {/* Top Header */}
      <div className="calendar-top-header">
        <div className="calendar-title-area">
          <h2>📅 Calendar</h2>
          <p className="calendar-subtitle">Interview dates, assessments &amp; follow-up tasks from your applications</p>
        </div>
        <div className="calendar-top-actions">
          <button className="btn btn-primary" onClick={onAddEvent}>+ Add Event</button>
        </div>
      </div>

      <div className="calendar-container">
        {/* Navigation */}
        <div className="calendar-nav-section">
          <button className="btn-icon" onClick={handlePrevMonth}>&lt;</button>
          <div className="calendar-month-center">
            <h3>{MONTHS[month]} {year}</h3>
            <button className="btn-link" style={{fontSize: '0.85rem', marginTop: '2px', color: 'var(--accent)'}} onClick={handleToday}>Today</button>
          </div>
          <button className="btn-icon" onClick={handleNextMonth}>&gt;</button>
        </div>

        {/* Legend */}
        <div className="calendar-legend-section">
          <div className="legend-item">
            <span className="legend-dot" style={{background: '#8b5cf6'}}></span>
            <span>Interview</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{background: '#14b8a6'}}></span>
            <span>Assessment</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{background: '#f97316'}}></span>
            <span>Follow Up</span>
          </div>
        </div>

        {/* Grid */}
        <div className="calendar-grid-wrapper">
          <div className="calendar-grid-header">
            {DAYS.map(day => <div key={day} className="calendar-day-name">{day}</div>)}
          </div>
          
          <div className="calendar-grid">
            {calendarDays.map((dayObj, idx) => {
              const dateStr = toISODate(dayObj.date)
              const isToday = dateStr === todayStr

              // Find events for this day
              const dayEvents = calendarEvents.filter(evt => evt.date === dateStr)

              return (
                <div 
                  key={idx} 
                  className={`calendar-cell ${!dayObj.isCurrentMonth ? 'calendar-cell--muted' : ''} ${isToday ? 'calendar-cell--today' : ''}`}
                >
                  <div className="calendar-date-number">
                    <span className={isToday ? 'today-highlight' : ''}>{dayObj.date.getDate()}</span>
                  </div>
                  
                  <div className="calendar-events">
                    {dayEvents.map(evt => {
                      let eventClass = ''
                      let eventLabel = evt.type
                      let displayTime = ''
                      
                      if (evt.type === 'Interview') {
                        eventClass = 'event-interview'
                        if (evt.time) displayTime = evt.time
                      } else if (evt.type === 'Assessment') {
                        eventClass = 'event-assessment'
                        if (evt.time) displayTime = evt.time
                        eventLabel = 'Assessment'
                      } else if (evt.type === 'Follow Up') {
                        eventClass = 'event-followup'
                        if (evt.time) displayTime = evt.time
                        eventLabel = 'Follow Up'
                      }

                      return (
                        <div 
                          key={evt.id} 
                          className={`calendar-event ${eventClass}`}
                          onClick={() => onView(evt.job)}
                          title={`${evt.type}: ${evt.role} at ${evt.company}${evt.note ? `\nNote: ${evt.note}` : ''}`}
                        >
                          <span className="event-time">
                            {displayTime ? displayTime : eventLabel}
                          </span>
                          <span className="event-title">{evt.company}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
