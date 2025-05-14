import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.models.session import Session as DBSession
from app.schemas.session import SessionCreate
from app.core.config import settings


def create_session(db: Session, session_in: SessionCreate) -> DBSession:
    now_utc = datetime.now(timezone.utc)
    expiration_time = now_utc + timedelta(days=settings.SESSION_DURATION_DAYS)
    db_session = DBSession(
        user_id=session_in.user_id,
        expires_at=expiration_time,
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


def get_user_id_from_session(db: Session, token: uuid.UUID | str) -> Optional[int]:
    if isinstance(token, uuid.UUID):
        token_for_query = str(token)
    else:
        token_for_query = token

    now_utc = datetime.now(timezone.utc)

    session = (
        db.query(DBSession)
        .filter(
            DBSession.token == token_for_query,
            DBSession.expires_at > now_utc,
        )
        .first()
    )

    if session:
        return session.user_id
    return None


def clean_expired_sessions(db: Session) -> int:
    now_utc = datetime.now(timezone.utc)

    deleted_count = db.query(DBSession).filter(DBSession.expires_at <= now_utc).delete()

    db.commit()
    return deleted_count


def logout_session(db: Session, token: uuid.UUID | str) -> Optional[int]:
    if isinstance(token, uuid.UUID):
        token_for_query = str(token)
    else:
        token_for_query = token

    now_utc = datetime.now(timezone.utc)

    session = db.query(DBSession).filter(DBSession.token == token_for_query).first()

    if session:
        user_id = session.user_id
        session.expires_at = now_utc
        db.commit()
        return user_id
    return None


def refresh_session(
    db: Session,
    token: uuid.UUID | str,
    duration_days: int = settings.SESSION_DURATION_DAYS,
) -> Optional[DBSession]:
    if isinstance(token, uuid.UUID):
        token_for_query = str(token)
    else:
        token_for_query = token

    now_utc = datetime.now(timezone.utc)
    new_expiration_time = now_utc + timedelta(days=duration_days)

    session = (
        db.query(DBSession)
        .filter(
            DBSession.token == token_for_query,
            DBSession.expires_at > now_utc,
        )
        .first()
    )

    if session:
        session.expires_at = new_expiration_time
        db.commit()
        db.refresh(session)
        return session
    return None
