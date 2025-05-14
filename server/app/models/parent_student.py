from sqlalchemy import Column, Integer, Boolean, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from app.db.session import Base


class ParentStudent(Base):
    __tablename__ = "parent_student_relationships"

    id = Column(Integer, primary_key=True, index=True)
    parent_user_id = Column(Integer, nullable=False)
    student_user_id = Column(Integer, nullable=False)

    deleted = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint(
            "parent_user_id", "student_user_id", name="unique_parent_student"
        ),
    )
