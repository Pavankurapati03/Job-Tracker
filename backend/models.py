from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
from datetime import date
import uuid


class JobStatus(str, Enum):
    applied = "Applied"
    interviewing = "Interviewing"
    offer = "Offer"
    rejected = "Rejected"


class JobCreate(BaseModel):
    company: str
    role: str
    status: JobStatus = JobStatus.applied
    location: Optional[str] = None
    notes: Optional[str] = None
    applied_date: date = Field(default_factory=date.today)


class JobUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[JobStatus] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    applied_date: Optional[date] = None


class Job(JobCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

    class Config:
        from_attributes = True
