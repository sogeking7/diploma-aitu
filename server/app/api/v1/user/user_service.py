from fastapi import HTTPException, status
from typing import Optional

from fastapi_pagination import Page
from pydantic import EmailStr
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserOut
from app.repositories import user as user_repo


def get_user(db: Session, user_id: int) -> Optional[User]:
    db_user = user_repo.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user_repo.get_user(db, user_id)


def get_users(db: Session) -> Page[UserOut]:
    return user_repo.get_users(db)


def create_user(db: Session, user_in: UserCreate) -> UserOut:
    if user_repo.get_user_by_email(db, user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already used"
        )

    return user_repo.insert_user(db, user_in)


def update_user(db: Session, user_id: int, user_in: UserUpdate) -> UserOut:
    return user_repo.update_user(db, user_id, user_in)


def delete_user(db: Session, user_id: int) -> None:
    user_repo.soft_delete_user(db, user_id)


def authenticate_user(db: Session, email: EmailStr, password: str) -> Optional[User]:
    return user_repo.authenticate_user(db, email, password)
