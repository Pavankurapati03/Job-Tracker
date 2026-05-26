from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import Job, JobCreate, JobUpdate, Event, EventType, User
from database import jobs_collection, serialize_doc, prepare_for_mongodb
from auth import get_current_user
import uuid

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@router.get("", response_model=List[Job])
async def get_all_jobs(current_user: User = Depends(get_current_user)):
    """Return all job applications for the logged-in user."""
    cursor = jobs_collection.find({"user_id": current_user.id})
    jobs = []
    async for doc in cursor:
        jobs.append(Job(**serialize_doc(doc)))
    return jobs


@router.post("", response_model=Job, status_code=201)
async def create_job(payload: JobCreate, current_user: User = Depends(get_current_user)):
    """Create a new job application for the logged-in user."""
    job_dict = payload.dict()
    job_dict["user_id"] = current_user.id
    job_dict["_id"] = str(uuid.uuid4())
    
    # Auto-sync interview_datetime if provided
    if payload.interview_datetime:
        dt = payload.interview_datetime
        new_event = Event(
            id=str(uuid.uuid4()),
            type=EventType.interview,
            date=dt.date(),
            time=dt.strftime("%H:%M"),
            note="Initial Interview scheduled from application form"
        )
        job_dict["events"].append(new_event.dict())
        
    await jobs_collection.insert_one(prepare_for_mongodb(job_dict))
    return Job(**serialize_doc(job_dict))


@router.get("/{job_id}", response_model=Job)
async def get_job(job_id: str, current_user: User = Depends(get_current_user)):
    """Get a single job by ID (restricted to owner)."""
    doc = await jobs_collection.find_one({"_id": job_id, "user_id": current_user.id})
    if not doc:
        raise HTTPException(status_code=404, detail="Job not found")
    return Job(**serialize_doc(doc))


@router.put("/{job_id}", response_model=Job)
async def update_job(job_id: str, payload: JobUpdate, current_user: User = Depends(get_current_user)):
    """Update a job application (restricted to owner)."""
    existing_job = await jobs_collection.find_one({"_id": job_id, "user_id": current_user.id})
    if not existing_job:
        raise HTTPException(status_code=404, detail="Job not found")

    updated_data = payload.dict(exclude_unset=True)

    # Auto-sync interview_datetime update
    if "interview_datetime" in updated_data:
        new_dt = updated_data["interview_datetime"]
        events_list = existing_job.get("events", [])
        events = [Event(**e) for e in events_list]
        
        if new_dt:
            found = False
            for evt in events:
                if evt.type == EventType.interview:
                    evt.date = new_dt.date()
                    evt.time = new_dt.strftime("%H:%M")
                    found = True
                    break
            if not found:
                new_event = Event(
                    id=str(uuid.uuid4()),
                    type=EventType.interview,
                    date=new_dt.date(),
                    time=new_dt.strftime("%H:%M"),
                    note="Initial Interview scheduled from application form"
                )
                events.append(new_event)
        else:
            events = [e for e in events if not (e.type == EventType.interview and e.note == "Initial Interview scheduled from application form")]

        updated_data["events"] = [e.dict() for e in events]

    if updated_data:
        await jobs_collection.update_one(
            {"_id": job_id, "user_id": current_user.id},
            {"$set": prepare_for_mongodb(updated_data)}
        )

    doc = await jobs_collection.find_one({"_id": job_id, "user_id": current_user.id})
    return Job(**serialize_doc(doc))


@router.delete("/{job_id}", status_code=204)
async def delete_job(job_id: str, current_user: User = Depends(get_current_user)):
    """Delete a job application (restricted to owner)."""
    res = await jobs_collection.delete_one({"_id": job_id, "user_id": current_user.id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")


@router.post("/{job_id}/events", response_model=Job)
async def add_job_event(job_id: str, event: Event, current_user: User = Depends(get_current_user)):
    """Add a custom event to a job application (restricted to owner)."""
    job_doc = await jobs_collection.find_one({"_id": job_id, "user_id": current_user.id})
    if not job_doc:
        raise HTTPException(status_code=404, detail="Job not found")
    
    events = job_doc.get("events", [])
    events.append(event.dict())
    
    await jobs_collection.update_one(
        {"_id": job_id, "user_id": current_user.id},
        {"$set": {"events": prepare_for_mongodb(events)}}
    )
    
    updated_doc = await jobs_collection.find_one({"_id": job_id, "user_id": current_user.id})
    return Job(**serialize_doc(updated_doc))


@router.delete("/{job_id}/events/{event_id}", response_model=Job)
async def delete_job_event(job_id: str, event_id: str, current_user: User = Depends(get_current_user)):
    """Delete a custom event from a job application (restricted to owner)."""
    job_doc = await jobs_collection.find_one({"_id": job_id, "user_id": current_user.id})
    if not job_doc:
        raise HTTPException(status_code=404, detail="Job not found")
    
    events = job_doc.get("events", [])
    filtered_events = [evt for evt in events if evt.get("id") != event_id]
    
    await jobs_collection.update_one(
        {"_id": job_id, "user_id": current_user.id},
        {"$set": {"events": prepare_for_mongodb(filtered_events)}}
    )
    
    updated_doc = await jobs_collection.find_one({"_id": job_id, "user_id": current_user.id})
    return Job(**serialize_doc(updated_doc))
