from typing import Optional, List
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate, AttendanceUpdate


def get_active_attendances(db: Session):
    return db.query(Attendance).filter_by(deleted=False)


def get_attendance(db: Session, attendance_id: int) -> Optional[Attendance]:
    return get_active_attendances(db).filter_by(id=attendance_id).first()


def get_attendances(db: Session, skip: int = 0, limit: int = 100) -> list[Attendance]:
    return get_active_attendances(db).offset(skip).limit(limit).all()


def get_attendances_by_student(db: Session, student_user_id: int) -> list[Attendance]:
    return get_active_attendances(db).filter_by(student_user_id=student_user_id).all()


def get_attendances_by_date_range(
    db: Session, start_date: datetime, end_date: datetime
) -> list[Attendance]:
    return (
        get_active_attendances(db)
        .filter(Attendance.time_in >= start_date, Attendance.time_in <= end_date)
        .all()
    )


def insert_attendance(db: Session, attendance_in: AttendanceCreate) -> Attendance:
    db_attendance = Attendance(
        student_user_id=attendance_in.student_user_id,
        time_in=attendance_in.time_in,
        time_out=attendance_in.time_out,
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance


def update_attendance(
    db: Session, attendance_id: int, attendance_in: AttendanceUpdate
) -> Attendance:
    db_attendance = get_attendance(db, attendance_id)
    if not db_attendance:
        raise ValueError(f"Attendance {attendance_id} not found")

    update_data = attendance_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_attendance, field, value)

    db.commit()
    db.refresh(db_attendance)
    return db_attendance


def soft_delete_attendance(db: Session, db_attendance: Attendance) -> None:
    db_attendance.deleted = True
    db.commit()
