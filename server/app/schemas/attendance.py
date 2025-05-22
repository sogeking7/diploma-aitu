from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AttendanceBase(BaseModel):
    student_user_id: int
    time_in: datetime
    time_out: Optional[datetime] = None


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceUpdate(AttendanceBase):
    student_user_id: Optional[int] = None
    time_in: Optional[datetime] = None
    time_out: Optional[datetime] = None


class AttendanceOut(AttendanceBase):
    id: int
    model_config = {"from_attributes": True}

class AttendanceFaceCreate(BaseModel):
    time_in: datetime
    time_out: Optional[datetime] = None