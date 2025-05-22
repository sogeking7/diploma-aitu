from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.schemas.user import UserBase


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
    student_user: Optional[UserBase]
    model_config = {"from_attributes": True}


class AttendanceFaceCreate(BaseModel):
    time_in: datetime
    time_out: Optional[datetime] = None


class FaceAttendanceOut(AttendanceOut):
    pass
