import httpx
from fastapi import HTTPException, status, UploadFile
from typing import Optional, List

from sqlalchemy.orm import Session
from datetime import datetime
from fastapi_pagination import Page, Params

from app.api.v1.faces import faces_service
from app.core.config import settings
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceUpdate,
    AttendanceOut,
    FaceAttendanceOut,
)
from app.repositories import attendance as attendance_repo
from app.schemas.face import SearchFaceMatch
from app.schemas.notification import NotificationOut
from app.schemas.parent_student import ParentStudentOut
from app.services.api_telegram import send_message
from app.services.face_db import FaceDatabase
from app.services.face_detector import FaceDetector
from app.repositories import notification as notification_repo
from app.repositories import parent_student as parent_student_repo
from app.repositories import user as user_repo


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

    user_id = found_face.face.user_id
    user = user_repo.get_user(db, user_id)

    current_time = datetime.now()

    existing_attendance = attendance_repo.get_todays_attendance_by_student(db, user_id)

    parents: List[type[ParentStudentOut]] = (
        parent_student_repo.get_parents_by_student_2(db, student_user_id=user_id)
    )

    chat_ids: List[int] = []
    for p in parents:
        parent_user_id = p.parent_user_id
        parent_notifications = notification_repo.get_notifications_by_user(
            db, user_id=parent_user_id
        )
        for pn in parent_notifications:
            chat_ids.append(pn.chat_id)

    if existing_attendance:
        text = f"Ваш ребенок {user.first_name} {user.last_name} вышел из школы в {current_time.strftime('%H:%M:%S')}"

        async with httpx.AsyncClient() as client:
            for chat_id in chat_ids:
                await send_message(client=client, chat_id=chat_id, text=text)

        update_data = AttendanceUpdate(time_out=current_time)
        return FaceAttendanceOut.model_validate(
            attendance_repo.update_attendance(db, existing_attendance.id, update_data)
        )
    else:
        text = f"Ваш ребенок {user.first_name} {user.last_name} пришел в школу в {current_time.strftime('%H:%M:%S')}"

        async with httpx.AsyncClient() as client:
            for chat_id in chat_ids:
                await send_message(client=client, chat_id=chat_id, text=text)

        new_attendance = AttendanceCreate(
            student_user_id=user_id, time_in=current_time, time_out=None
        )
        return FaceAttendanceOut.model_validate(
            attendance_repo.insert_attendance(db, new_attendance)
        )
