from pydantic import BaseModel
from typing import Optional


class ClassBase(BaseModel):
    name: str
    teacher_user_id: int


class ClassCreate(ClassBase):
    pass


class ClassUpdate(BaseModel):
    name: Optional[str] = None
    teacher_user_id: Optional[int] = None


class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    id: int
    model_config = {"from_attributes": True}


class ClassOut(ClassBase):
    id: int
    name: str
    teacher_user: UserBase
    enrolled_students_count: Optional[int] = 0
    model_config = {"from_attributes": True}
