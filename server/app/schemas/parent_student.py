from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.schemas.user import UserBase


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
    parent_user: Optional[UserBase]
    student_user: Optional[UserBase]
    model_config = {"from_attributes": True}
