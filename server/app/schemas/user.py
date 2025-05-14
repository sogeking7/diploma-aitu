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


class UserUpdate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    role: RoleEnum


class UserOut(UserBase):
    id: int


class Login(BaseModel):
    username: EmailStr
    password: str
