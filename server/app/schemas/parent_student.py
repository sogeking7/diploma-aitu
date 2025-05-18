from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ParentStudentBase(BaseModel):
    parent_user_id: int
    student_user_id: int


class ParentStudentCreate(ParentStudentBase):
    pass


class ParentStudentUpdate(ParentStudentBase):
    parent_user_id: Optional[int] = None
    student_user_id: Optional[int] = None


class ParentStudentOut(ParentStudentBase):
    id: int
    model_config = {"from_attributes": True}
