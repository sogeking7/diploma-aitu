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


class ClassOut(ClassBase):
    id: int
