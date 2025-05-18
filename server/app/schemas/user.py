from pydantic import BaseModel, EmailStr
from enum import Enum


class RoleEnum(str, Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"
    PARENT = "parent"


class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    role: RoleEnum


class UserCreate(UserBase):
    password: str
    pass


class UserUpdate(UserBase):
    pass


class UserOut(UserBase):
    id: int
    model_config = {"from_attributes": True}


class Login(BaseModel):
    username: EmailStr
    password: str
