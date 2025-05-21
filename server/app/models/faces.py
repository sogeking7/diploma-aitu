import uuid
from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    func,
    String,
    Boolean,
)
from sqlalchemy.orm import relationship

from app.db.session import Base


class Face(Base):
    __tablename__ = "faces"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)

    deleted = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship(
        "User",
        primaryjoin="Face.user_id == User.id",
        foreign_keys=[user_id],
        uselist=False,
    )
