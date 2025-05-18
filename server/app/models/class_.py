from sqlalchemy import Column, Integer, String, Boolean, DateTime, and_
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.sql import func

from app.db.session import Base


class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    teacher_user_id = Column(Integer, nullable=False)

    deleted = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    teacher_user = relationship(
        "User",
        primaryjoin="Class.teacher_user_id == User.id",
        foreign_keys=[teacher_user_id],
        uselist=False,
    )

    students = relationship(
        "ClassStudent",
        primaryjoin="and_(Class.id == ClassStudent.class_id, ClassStudent.deleted == false())",
        foreign_keys="[ClassStudent.class_id]",
    )
