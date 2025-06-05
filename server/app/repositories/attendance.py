from typing import Optional
from sqlalchemy import desc
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

from app.models import User
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate, AttendanceUpdate, AttendanceOut


def get_active_attendances(db: Session):
    return (
        db.query(Attendance)
        .join(User, Attendance.student_user_id == User.id)
        .filter(Attendance.deleted == False)
        .order_by(desc(Attendance.time_in))
        .options(joinedload(Attendance.student_user))
    )


def get_attendance(db: Session, attendance_id: int) -> Optional[AttendanceOut]:
    db_attendance = (
        get_active_attendances(db).filter(Attendance.id == attendance_id).first()
    )
    if db_attendance:
        return AttendanceOut.model_validate(db_attendance, from_attributes=True)
    return None


def get_attendances(db: Session) -> Page[AttendanceOut]:
    query = get_active_attendances(db)
    page = paginate(db, query)
    page.items = [
        AttendanceOut.model_validate(item, from_attributes=True) for item in page.items
    ]
    return page


def get_attendances_by_student(
    db: Session, student_user_id: int
) -> Page[AttendanceOut]:
    query = get_active_attendances(db).filter(
        Attendance.student_user_id == student_user_id
    )
    page = paginate(db, query)
    page.items = [
        AttendanceOut.model_validate(item, from_attributes=True) for item in page.items
    ]
    return page


def get_attendances_by_date_range(
    db: Session, start_date: datetime, end_date: datetime
) -> Page[AttendanceOut]:
    query = get_active_attendances(db).filter(
        Attendance.time_in >= start_date, Attendance.time_in <= end_date
    )
    page = paginate(db, query)
    page.items = [
        AttendanceOut.model_validate(item, from_attributes=True) for item in page.items
    ]
    return page


def insert_attendance(db: Session, attendance_in: AttendanceCreate) -> AttendanceOut:
    try:
        db_attendance = Attendance(
            student_user_id=attendance_in.student_user_id,
            time_in=attendance_in.time_in,
            time_out=attendance_in.time_out,
        )
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        return AttendanceOut.model_validate(db_attendance, from_attributes=True)
    except Exception as e:
        db.rollback()
        raise e


def update_attendance(
    db: Session, attendance_id: int, attendance_in: AttendanceUpdate
) -> AttendanceOut:
    try:
        db_attendance = (
            get_active_attendances(db).filter(Attendance.id == attendance_id).first()
        )
        if not db_attendance:
            raise ValueError(f"Attendance {attendance_id} not found")

        update_data = attendance_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_attendance, field, value)

        db.commit()
        db.refresh(db_attendance)
        return AttendanceOut.model_validate(db_attendance, from_attributes=True)
    except Exception as e:
        db.rollback()
        raise e


def soft_delete_attendance(db: Session, attendance_id: int) -> None:
    try:
        attendance = (
            get_active_attendances(db).filter(Attendance.id == attendance_id).first()
        )
        if not attendance:
            raise ValueError(f"Attendance {attendance_id} not found")
        attendance.deleted = True
        db.commit()
    except Exception as e:
        db.rollback()
        raise e


def get_attendances_by_date_range_and_student(
    db: Session, start_date: datetime, end_date: datetime, student_user_id: int
) -> Page[AttendanceOut]:
    query = get_active_attendances(db).filter(
        Attendance.time_in >= start_date,
        Attendance.time_in <= end_date,
        Attendance.student_user_id == student_user_id,
    )
    page = paginate(db, query)
    page.items = [
        AttendanceOut.model_validate(item, from_attributes=True) for item in page.items
    ]
    return page


def get_todays_attendance_by_student(
    db: Session, student_user_id: int
) -> Optional[Attendance]:
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start.replace(hour=23, minute=59, second=59, microsecond=999999)

    return (
        get_active_attendances(db)
        .filter(
            Attendance.student_user_id == student_user_id,
            Attendance.time_in >= today_start,
            Attendance.time_in <= today_end,
        )
        .first()
    )
