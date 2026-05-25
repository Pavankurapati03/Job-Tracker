"""
In-memory data store for Phase 1.
Will be replaced by MongoDB in Phase 2.
"""
from typing import Dict
from models import Job

# Simple dict: { job_id: Job }
jobs_store: Dict[str, Job] = {}
