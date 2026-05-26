from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.jobs import router as jobs_router
from routes.auth import router as auth_router

app = FastAPI(
    title="Job Tracker API",
    description="Track your job applications — Phase 2",
    version="2.0.0",
)

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local testing convenience, or restrict as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(jobs_router)


@app.get("/")
def root():
    return {"message": "Job Tracker API is running 🚀"}

