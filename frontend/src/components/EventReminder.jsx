import { useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';

export default function EventReminder({ jobs }) {
  const { info } = useToast();
  const notifiedEventsRef = useRef(new Set(JSON.parse(localStorage.getItem('notifiedEvents') || '[]')));

  // Request browser notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const saveNotified = (eventId, type) => {
    const key = `${eventId}_${type}`;
    notifiedEventsRef.current.add(key);
    localStorage.setItem('notifiedEvents', JSON.stringify(Array.from(notifiedEventsRef.current)));
  };

  const hasBeenNotified = (eventId, type) => {
    return notifiedEventsRef.current.has(`${eventId}_${type}`);
  };

  const sendNativeNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  useEffect(() => {
    if (!jobs || jobs.length === 0) return;

    const checkEvents = () => {
      const now = new Date();

      jobs.forEach(job => {
        const events = job.events || [];
        // Include interview_datetime as an implicit event if present
        if (job.interview_datetime) {
            events.push({
                id: `legacy-interview-${job.id}`,
                type: 'Interview',
                date: job.interview_datetime.slice(0, 10),
                time: job.interview_datetime.slice(11, 16),
                title: job.company
            })
        }

        events.forEach(evt => {
          if (!evt.date) return;
          
          let eventDateObj;
          if (evt.time) {
            // Assume time is HH:MM
            eventDateObj = new Date(`${evt.date}T${evt.time}`);
          } else {
             // If no time, assume 9 AM local time for the date
             eventDateObj = new Date(`${evt.date}T09:00:00`);
          }

          if (isNaN(eventDateObj.getTime())) return;

          const timeDiffHours = (eventDateObj - now) / (1000 * 60 * 60);

          const eventTitle = evt.title || job.company;
          const msgBase = `${evt.type} at ${eventTitle}`;

          // Check 1 day before (between 23.9 and 24.1 hours to catch it in a 1-min poll)
          if (timeDiffHours > 0 && timeDiffHours <= 24 && !hasBeenNotified(evt.id, '1day')) {
             const msg = `Upcoming Tomorrow: ${msgBase}`;
             info(msg, 10000); // 10s toast
             sendNativeNotification('Job Tracker Reminder', msg);
             saveNotified(evt.id, '1day');
          }

          // Check 1 hour before
          if (timeDiffHours > 0 && timeDiffHours <= 1 && !hasBeenNotified(evt.id, '1hour')) {
             const msg = `Starting Soon: ${msgBase}`;
             info(msg, 15000); // 15s toast
             sendNativeNotification('Job Tracker Reminder', msg);
             saveNotified(evt.id, '1hour');
          }
        });
      });
    };

    // Check immediately, then every 60 seconds
    checkEvents();
    const interval = setInterval(checkEvents, 60000);

    return () => clearInterval(interval);
  }, [jobs, info]);

  return null; // Background component, no UI
}
