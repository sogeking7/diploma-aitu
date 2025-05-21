import uuid
from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    func,
    String,
    Boolean,
)
from app.db.session import Base


class Face(Base):
    __tablename__ = "faces"

    id = Column(
        String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id = Column(Integer, nullable=False)

    deleted = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
