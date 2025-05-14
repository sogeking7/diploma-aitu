from fastapi import HTTPException, status
from typing import Optional, List
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate, AttendanceUpdate
from app.repositories import attendance as attendance_repo


def get_attendance(db: Session, attendance_id: int) -> Optional[Attendance]:
    db_attendance = attendance_repo.get_attendance(db, attendance_id=attendance_id)
    if db_attendance is None:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    return db_attendance


def get_attendances(db: Session, skip: int = 0, limit: int = 100) -> List[Attendance]:
    return attendance_repo.get_attendances(db, skip=skip, limit=limit)


def get_attendances_by_student(db: Session, student_user_id: int) -> List[Attendance]:
    return attendance_repo.get_attendances_by_student(
        db, student_user_id=student_user_id
    )


def get_attendances_by_date_range(
    db: Session, start_date: datetime, end_date: datetime
) -> List[Attendance]:
    return attendance_repo.get_attendances_by_date_range(
        db, start_date=start_date, end_date=end_date
    )


def create_attendance(db: Session, attendance_in: AttendanceCreate) -> Attendance:
    return attendance_repo.insert_attendance(db, attendance_in)


def update_attendance(
    db: Session, attendance_id: int, attendance_in: AttendanceUpdate
) -> Attendance:
    try:
        return attendance_repo.update_attendance(db, attendance_id, attendance_in)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


def delete_attendance(db: Session, attendance_id: int) -> None:
    db_attendance = attendance_repo.get_attendance(db, attendance_id)
    if not db_attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attendance record with id {attendance_id} not found",
        )

    attendance_repo.soft_delete_attendance(db, db_attendance)
