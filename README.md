# Job Tracker

A full-stack job application tracker built with **React + Vite** (frontend) and **FastAPI** (backend).

---

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm
- **MongoDB Atlas** account (or local MongoDB)

# Run the server
uvicorn main:app --reload
```
---

## Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

| Method | Endpoint           | Description     |
|--------|--------------------|-----------------|
| GET    | `/api/jobs`        | List all jobs   |
| POST   | `/api/jobs`        | Create a job    |
| GET    | `/api/jobs/{id}`   | Get one job     |
| PUT    | `/api/jobs/{id}`   | Update a job    |
| DELETE | `/api/jobs/{id}`   | Delete a job    |

---

## Project Structure

```
Job-Tracker/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── store.py
│   ├── routes/
│   │   └── jobs.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/jobsApi.js
│   │   ├── components/
│   │   └── App.jsx
│   └── vite.config.js
├── .gitignore
└── README.md
```
