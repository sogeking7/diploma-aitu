from pydantic import BaseModel, EmailStr
from enum import Enum


class RoleEnum(str, Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"
    PARENT = "parent"


class UserBase(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    role: RoleEnum


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    role: RoleEnum


class UserUpdate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    role: RoleEnum


class UserOut(UserBase):
    model_config = {"from_attributes": True}


class Login(BaseModel):
    username: EmailStr
    password: str
