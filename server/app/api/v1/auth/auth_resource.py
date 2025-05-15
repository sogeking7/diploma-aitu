from fastapi import APIRouter, Depends, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi import Request

from app.core.config import settings
from app.schemas.auth import TokenModel
from app.schemas.user import UserCreate
from app.api.dependencies import get_db
from app.api.v1.auth import auth_service
from app.models.session import Session as DBSession


router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_: UserCreate, db: Session = Depends(get_db)):
    auth_service.register_user(db=db, user_in=user_)
    return Response(status_code=status.HTTP_201_CREATED)


@router.post("/login", response_model=TokenModel)
def login(
    form_: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
    response: Response = None,
):
    db_session: DBSession = auth_service.login_user(
        db=db, username=form_.username, password=form_.password
    )

    session_token_str = str(db_session.token)

    response.set_cookie(
        key="session_token",
        value=session_token_str,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.SESSION_DURATION_DAYS * 24 * 60 * 60,
        # domain="localhost",
    )

    return TokenModel(access_token=session_token_str, token_type="bearer")


@router.post("/logout", status_code=status.HTTP_201_CREATED)
def logout(
    db: Session = Depends(get_db), response: Response = None, request: Request = None
):
    session_token = request.cookies.get("session_token")

    print(session_token)

    user_id = auth_service.logout_user(db=db, session_id=session_token)

    response.delete_cookie(
        key="session_token",
        httponly=True,
        secure=True,
        samesite="lax",
        # domain="localhost",
    )

    return {"user_id": user_id}
