from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import Optional

from app.api.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.user import UserOut, UserCreate, UserUpdate, RoleEnum
from app.api.v1.user import user_service

from fastapi_pagination import Page

router = APIRouter()


@router.get("/me", response_model=UserOut, summary="Get Current User")
def read_current_user(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.post("/", response_model=UserOut)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return user_service.create_user(db=db, user_in=user)


@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return user_service.update_user(db=db, user_id=user_id, user_in=user)


@router.get("/", response_model=Page[UserOut])
def read_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: Optional[RoleEnum] = None,
    q: Optional[str] = None,
):
    return user_service.get_users(db, role=role, q=q)


@router.get("/{user_id}", response_model=UserOut)
def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return user_service.get_user(db, user_id=user_id)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return user_service.delete_user(db, user_id=user_id)
