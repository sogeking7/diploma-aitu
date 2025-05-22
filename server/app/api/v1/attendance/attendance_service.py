from fastapi import HTTPException, status, UploadFile
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi_pagination import Page

from app.api.v1.faces import faces_service
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceUpdate,
    AttendanceOut,
    FaceAttendanceOut,
)
from app.repositories import attendance as attendance_repo
from app.schemas.face import SearchFaceMatch
from app.services.face_db import FaceDatabase
from app.services.face_detector import FaceDetector


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


def get_attendances_by_date_range_and_student(
    db: Session, start_date: datetime, end_date: datetime, student_user_id: int
) -> Page[AttendanceOut]:
    return attendance_repo.get_attendances_by_date_range_and_student(
        db, start_date=start_date, end_date=end_date, student_user_id=student_user_id
    )


async def create_face_attendance(
    db: Session,
    face_detector: FaceDetector,
    face_db: FaceDatabase,
    threshold: float,
    k: int,
    image: UploadFile,
) -> FaceAttendanceOut:
    found_face: SearchFaceMatch = await faces_service.search_face(
        db, face_detector, face_db, image, threshold, k
    )

    face_id = found_face.face.id
    user_id = found_face.face.user_id

    current_time = datetime.now()

    existing_attendance = attendance_repo.get_todays_attendance_by_student(db, user_id)

    if existing_attendance:
        update_data = AttendanceUpdate(time_out=current_time)
        return FaceAttendanceOut.model_validate(
            attendance_repo.update_attendance(db, existing_attendance.id, update_data)
        )
    else:
        new_attendance = AttendanceCreate(
            student_user_id=user_id, time_in=current_time, time_out=None
        )
        return FaceAttendanceOut.model_validate(
            attendance_repo.insert_attendance(db, new_attendance)
        )
