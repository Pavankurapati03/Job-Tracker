# Job Tracker 🎯

A full-stack job application tracker built with **React + Vite** (frontend) and **FastAPI** (backend).

---

## Phase 2 — Database & Auth Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm
- **MongoDB Atlas** account (or local MongoDB)

---

## Backend (FastAPI)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up your environment variables
cp .env.example .env
# Edit .env and add your MONGO_URI and JWT_SECRET

# Run the server
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
