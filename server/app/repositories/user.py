from typing import Optional, List, Any
from pydantic import EmailStr
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password


def get_active_users(db: Session):
    return db.query(User).filter_by(deleted=False)


def get_user(db: Session, user_id: int) -> Optional[User]:
    return get_active_users(db).filter_by(id=user_id).first()


def get_user_by_email(db: Session, email: EmailStr) -> Optional[User]:
    return get_active_users(db).filter_by(email=email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> list[type[User]]:
    return get_active_users(db).offset(skip).limit(limit).all()


def insert_user(db: Session, user_in: UserCreate) -> User:
    user = User(
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user_id: int, user_in: UserUpdate) -> User:
    user = get_user(db, user_id)
    if not user:
        raise ValueError(f"User {user_id} not found")
    for field, value in user_in.dict(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def soft_delete_user(db: Session, user: User) -> None:
    user.deleted = True
    db.commit()


def authenticate_user(db: Session, email: EmailStr, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if user and verify_password(password, user.hashed_password):
        return user
    return None
