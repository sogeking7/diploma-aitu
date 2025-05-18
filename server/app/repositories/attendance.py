from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate, AttendanceUpdate, AttendanceOut


def get_active_attendances(db: Session):
    return db.query(Attendance).filter_by(deleted=False)


def get_attendance(db: Session, attendance_id: int) -> Optional[AttendanceOut]:
    return get_active_attendances(db).filter_by(id=attendance_id).first()


def get_attendances(db: Session) -> Page[AttendanceOut]:
    return paginate(db, get_active_attendances(db))


def get_attendances_by_student(
    db: Session, student_user_id: int
) -> Page[AttendanceOut]:
    return paginate(
        db, get_active_attendances(db).filter_by(student_user_id=student_user_id)
    )


def get_attendances_by_date_range(
    db: Session, start_date: datetime, end_date: datetime
) -> Page[AttendanceOut]:
    return paginate(
        db,
        get_active_attendances(db).filter(
            Attendance.time_in >= start_date, Attendance.time_in <= end_date
        ),
    )


def insert_attendance(db: Session, attendance_in: AttendanceCreate) -> AttendanceOut:
    db_attendance = Attendance(
        student_user_id=attendance_in.student_user_id,
        time_in=attendance_in.time_in,
        time_out=attendance_in.time_out,
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return AttendanceOut.model_validate(db_attendance)


def update_attendance(
    db: Session, attendance_id: int, attendance_in: AttendanceUpdate
) -> AttendanceOut:
    db_attendance = get_active_attendances(db).filter_by(id=attendance_id).first()
    if not db_attendance:
        raise ValueError(f"Attendance {attendance_id} not found")

    update_data = attendance_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_attendance, field, value)

    db.commit()
    db.refresh(db_attendance)
    return AttendanceOut.model_validate(db_attendance)


def soft_delete_attendance(db: Session, attendance_id: int) -> None:
    attendance = get_active_attendances(db).filter_by(id=attendance_id).first()
    if not attendance:
        raise ValueError(f"Attendance {attendance_id} not found")
    attendance.deleted = True
    db.commit()
