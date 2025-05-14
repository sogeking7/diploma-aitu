from sqlalchemy import Column, Integer, DateTime, Boolean, func
from app.db.session import Base


class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    student_user_id = Column(Integer, nullable=False)
    time_in = Column(DateTime, nullable=False)
    time_out = Column(DateTime, nullable=True)

    deleted = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
