from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.schemas.session import SessionCreate
from app.schemas.user import UserCreate
from app.repositories.user import get_user_by_email, authenticate_user, insert_user
from app.repositories.session import create_session as create_db_session

from pydantic import EmailStr


def register_user(db: Session, user_in: UserCreate):
    db_user = get_user_by_email(db, email=user_in.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already used"
        )
    created_user = insert_user(db=db, user_in=user_in)


def login_user(db: Session, username: EmailStr, password: str):
    user = authenticate_user(db, username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    session_in = SessionCreate(user_id=user.id)
    db_session = create_db_session(db=db, session_in=session_in)

    return db_session
