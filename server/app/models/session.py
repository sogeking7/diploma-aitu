import uuid

from sqlalchemy import Column, Integer, DateTime, func, String, CheckConstraint
from app.db.session import Base


class Session(Base):
    __tablename__ = "sessions"

    token = Column(
        String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id = Column(Integer, nullable=False)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    expires_at = Column(DateTime(timezone=True), nullable=False)

    __table_args__ = (
        CheckConstraint(created_at < expires_at, name="check_created_before_expires"),
    )
