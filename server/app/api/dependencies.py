from functools import lru_cache
from typing import Optional
from fastapi import Depends, HTTPException, status, Cookie, Request, Header
from sqlalchemy.orm import Session

from app.core.logger import get_logger
from app.db.session import SessionLocal
from app.repositories.session import get_user_id_from_session
from app.repositories.user import get_user as get_user_repo
from app.models.user import User
from app.schemas.user import RoleEnum
from app.services.face_db import FaceDatabase
from app.services.face_detector import FaceDetector

logger = get_logger(__name__)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@lru_cache()
def get_face_db():
    return FaceDatabase()


@lru_cache()
def get_face_detector():
    return FaceDetector()


def get_token_from_request(
    session_token: Optional[str] = Cookie(None, include_in_schema=False),
    authorization: Optional[str] = Header(None, include_in_schema=False),
) -> Optional[str]:
    token = None
    if session_token:
        token = session_token
    elif authorization:
        scheme, _, token_value = authorization.partition(" ")
        if scheme.lower() == "bearer" and token_value:
            token = token_value
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Authentication header format",
                headers={"WWW-Authenticate": "Bearer"},
            )
    return token


def get_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(get_token_from_request),
) -> User:
    if token is None:
        logger.warning("Attempted to get current user without a token.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated (no token provided)",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = get_user_id_from_session(db, token=token)

    if user_id is None:
        logger.warning(f"Invalid or expired session token provided: {token[:10]}...")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = get_user_repo(db, user_id=user_id)

    if user is None:
        logger.error(f"User ID {user_id} from session token {token[:10]}... not found.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User associated with session not found",
        )

    logger.debug(f"Authenticated user {user.id} via session.")
    return user


def is_admin(user: User) -> bool:
    return user and user.role and user.role.lower() == RoleEnum.ADMIN.value.lower()


def user_has_role(user: User, required_role: RoleEnum) -> bool:
    return user and user.role and user.role.lower() == required_role.value.lower()


def require_role(required_role: RoleEnum):
    if not isinstance(required_role, RoleEnum):
        raise TypeError(
            f"Invalid required_role type: {type(required_role)}. Must be a member of RoleEnum."
        )

    def _require_role(current_user: User = Depends(get_current_user)) -> User:
        if is_admin(current_user):
            logger.debug(
                f"User {current_user.id} granted access via admin bypass for role {required_role.value}"
            )
            return current_user

        if user_has_role(current_user, required_role):
            logger.debug(
                f"User {current_user.id} granted access with role {required_role.value}"
            )
            return current_user

        logger.warning(
            f"User {current_user.id} forbidden access. Requires {required_role.value} or {RoleEnum.ADMIN.value}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"User must have the '{required_role.value}' or '{RoleEnum.ADMIN.value}' role to access this resource.",
        )

    return _require_role


require_admin_role = require_role(RoleEnum.ADMIN)
require_student_role = require_role(RoleEnum.STUDENT)
require_teacher_role = require_role(RoleEnum.TEACHER)
require_parent_role = require_role(RoleEnum.PARENT)
