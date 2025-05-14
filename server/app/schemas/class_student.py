from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ClassStudentBase(BaseModel):
    class_id: int
    student_user_id: int


class ClassStudentCreate(ClassStudentBase):
    pass


class ClassStudentUpdate(BaseModel):
    class_id: Optional[int] = None
    student_user_id: Optional[int] = None


class ClassStudentOut(ClassStudentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
