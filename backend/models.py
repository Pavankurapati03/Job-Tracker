from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
from datetime import date, datetime
import uuid


class JobStatus(str, Enum):
    applied = "Applied"
    interviewing = "Interviewing"
    offer = "Offer"
    rejected = "Rejected"


class JobType(str, Enum):
    full_time = "Full-time"
    part_time = "Part-time"
    internship = "Internship"
    contract = "Contract"


class WorkMode(str, Enum):
    remote = "Remote"
    hybrid = "Hybrid"
    on_site = "On-site"


class Priority(str, Enum):
    high = "High"
    medium = "Medium"
    low = "Low"


class EventType(str, Enum):
    interview = "Interview"
    assessment = "Assessment"
    follow_up = "Follow Up"


class Event(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: EventType
    date: date
    time: Optional[str] = None
    note: Optional[str] = None


# ── User & Auth Models ──
class UserRegister(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    username: str  # Can be username or email
    password: str


class UserResponse(BaseModel):
    id: str
    username: str
    email: str


class Token(BaseModel):
    access_token: str
    token_type: str


class User(BaseModel):
    id: str
    username: str
    email: str
    hashed_password: str


# ── Account Management Models ──
class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    current_password: str


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


class AccountDelete(BaseModel):
    current_password: str


# ── Job Models ──
class JobCreate(BaseModel):
    company: str
    role: str
    status: JobStatus = JobStatus.applied
    location: Optional[str] = None
    notes: Optional[str] = None
    applied_date: date = Field(default_factory=date.today)
    pinned: bool = False
    salary: Optional[str] = None
    job_type: Optional[JobType] = None
    work_mode: Optional[WorkMode] = None
    interview_datetime: Optional[datetime] = None
    job_url: Optional[str] = None
    priority: Optional[Priority] = None
    events: List[Event] = []
    user_id: Optional[str] = None


class JobUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[JobStatus] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    applied_date: Optional[date] = None
    pinned: Optional[bool] = None
    salary: Optional[str] = None
    job_type: Optional[JobType] = None
    work_mode: Optional[WorkMode] = None
    interview_datetime: Optional[datetime] = None
    job_url: Optional[str] = None
    priority: Optional[Priority] = None
    events: Optional[List[Event]] = None
    user_id: Optional[str] = None


class Job(JobCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

    class Config:
        from_attributes = True
        populate_by_name = True
