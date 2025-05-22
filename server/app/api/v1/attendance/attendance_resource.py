from fastapi import APIRouter, Depends, status, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi_pagination import Page

from app.api.dependencies import (
    get_db,
    get_current_user,
    get_face_detector,
    get_face_db,
)
from app.models.user import User
from app.schemas.attendance import (
    AttendanceOut,
    AttendanceCreate,
    AttendanceUpdate,
    AttendanceFaceCreate,
    FaceAttendanceOut,
)
from app.api.v1.attendance import attendance_service
from app.services.face_db import FaceDatabase
from app.services.face_detector import FaceDetector

router = APIRouter()


@router.post("/", response_model=AttendanceOut, status_code=status.HTTP_201_CREATED)
def create_attendance(
    attendance_in: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return attendance_service.create_attendance(db=db, attendance_in=attendance_in)


@router.put("/{attendance_id}", response_model=AttendanceOut)
def update_attendance(
    attendance_id: int,
    attendance_in: AttendanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return attendance_service.update_attendance(
        db=db, attendance_id=attendance_id, attendance_in=attendance_in
    )


@router.get("/", response_model=Page[AttendanceOut])
def read_attendances(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return attendance_service.get_attendances(db)


@router.get("/student/{student_id}", response_model=Page[AttendanceOut])
def read_attendances_by_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return attendance_service.get_attendances_by_student(db, student_user_id=student_id)


@router.get("/date-range", response_model=Page[AttendanceOut])
def read_attendances_by_date_range(
    start_date: datetime = Query(..., description="Start date for attendance records"),
    end_date: datetime = Query(..., description="End date for attendance records"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return attendance_service.get_attendances_by_date_range(
        db, start_date=start_date, end_date=end_date
    )


@router.get("/{attendance_id}", response_model=AttendanceOut)
def read_attendance(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return attendance_service.get_attendance(db, attendance_id=attendance_id)


@router.delete("/{attendance_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_attendance(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return attendance_service.delete_attendance(db, attendance_id=attendance_id)


@router.post(
    "/face", status_code=status.HTTP_201_CREATED, response_model=FaceAttendanceOut
)
async def create_face_attendance(
    image: UploadFile = File(...),
    threshold: float = Form(0.8),
    k: int = Form(1),
    face_detector: FaceDetector = Depends(get_face_detector),
    face_db: FaceDatabase = Depends(get_face_db),
    db: Session = Depends(get_db),
):
    return await attendance_service.create_face_attendance(
        db=db,
        face_detector=face_detector,
        threshold=threshold,
        k=k,
        face_db=face_db,
        image=image,
    )


@router.get("/student/{student_id}/date-range", response_model=Page[AttendanceOut])
def read_attendances_by_date_range_and_student(
    student_id: int,
    start_date: datetime = Query(..., description="Start date for attendance records"),
    end_date: datetime = Query(..., description="End date for attendance records"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return attendance_service.get_attendances_by_date_range_and_student(
        db, start_date=start_date, end_date=end_date, student_user_id=student_id
    )
