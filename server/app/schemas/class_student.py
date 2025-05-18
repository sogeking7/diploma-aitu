from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ClassStudentBase(BaseModel):
    class_id: int
    student_user_id: int


class ClassStudentCreate(ClassStudentBase):
    pass


class ClassStudentUpdate(ClassStudentBase):
    class_id: Optional[int] = None
    student_user_id: Optional[int] = None


class ClassStudentOut(ClassStudentBase):
    id: int
    model_config = {"from_attributes": True}
