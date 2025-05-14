from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AttendanceBase(BaseModel):
    student_user_id: int
    time_in: datetime
    time_out: Optional[datetime] = None


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceUpdate(BaseModel):
    time_out: Optional[datetime] = None


class AttendanceOut(AttendanceBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
