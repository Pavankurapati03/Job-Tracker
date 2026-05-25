# Job Tracker 🎯

A full-stack job application tracker built with **React + Vite** (frontend) and **FastAPI** (backend).

---

## Phase 1 — Local Development Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm

---

## Backend (FastAPI)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on: http://localhost:8000  
Swagger docs: http://localhost:8000/docs

---

## Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

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
