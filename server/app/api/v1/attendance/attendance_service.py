from fastapi import HTTPException, status
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi_pagination import Page

from app.schemas.attendance import AttendanceCreate, AttendanceUpdate, AttendanceOut
from app.repositories import attendance as attendance_repo


def get_attendance(db: Session, attendance_id: int) -> Optional[AttendanceOut]:
    db_attendance = attendance_repo.get_attendance(db, attendance_id=attendance_id)
    if db_attendance is None:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    return db_attendance


def get_attendances(db: Session) -> Page[AttendanceOut]:
    return attendance_repo.get_attendances(db)


def get_attendances_by_student(
    db: Session, student_user_id: int
) -> Page[AttendanceOut]:
    return attendance_repo.get_attendances_by_student(
        db, student_user_id=student_user_id
    )


def get_attendances_by_date_range(
    db: Session, start_date: datetime, end_date: datetime
) -> Page[AttendanceOut]:
    return attendance_repo.get_attendances_by_date_range(
        db, start_date=start_date, end_date=end_date
    )


def create_attendance(db: Session, attendance_in: AttendanceCreate) -> AttendanceOut:
    return attendance_repo.insert_attendance(db, attendance_in)


def update_attendance(
    db: Session, attendance_id: int, attendance_in: AttendanceUpdate
) -> AttendanceOut:
    try:
        return attendance_repo.update_attendance(db, attendance_id, attendance_in)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


def delete_attendance(db: Session, attendance_id: int) -> None:
    try:
        attendance_repo.soft_delete_attendance(db, attendance_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
