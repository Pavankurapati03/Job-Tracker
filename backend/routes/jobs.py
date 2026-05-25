from fastapi import APIRouter, HTTPException
from typing import List
from models import Job, JobCreate, JobUpdate
from store import jobs_store

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@router.get("", response_model=List[Job])
def get_all_jobs():
    """Return all job applications."""
    return list(jobs_store.values())


@router.post("", response_model=Job, status_code=201)
def create_job(payload: JobCreate):
    """Create a new job application."""
    job = Job(**payload.model_dump())
    jobs_store[job.id] = job
    return job


@router.get("/{job_id}", response_model=Job)
def get_job(job_id: str):
    """Get a single job by ID."""
    job = jobs_store.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.put("/{job_id}", response_model=Job)
def update_job(job_id: str, payload: JobUpdate):
    """Update a job application (partial update supported)."""
    job = jobs_store.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    updated_data = payload.model_dump(exclude_unset=True)
    updated_job = job.model_copy(update=updated_data)
    jobs_store[job_id] = updated_job
    return updated_job


@router.delete("/{job_id}", status_code=204)
def delete_job(job_id: str):
    """Delete a job application."""
    if job_id not in jobs_store:
        raise HTTPException(status_code=404, detail="Job not found")
    del jobs_store[job_id]
