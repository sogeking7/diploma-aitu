from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ParentStudentBase(BaseModel):
    parent_user_id: int
    student_user_id: int


class ParentStudentCreate(ParentStudentBase):
    pass


class ParentStudentUpdate(BaseModel):
    parent_user_id: Optional[int] = None
    student_user_id: Optional[int] = None


class ParentStudentOut(ParentStudentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
