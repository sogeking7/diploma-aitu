from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.api.dependencies import get_db
from app.schemas.attendance import AttendanceOut, AttendanceCreate, AttendanceUpdate
from app.api.v1.attendance import attendance_service

router = APIRouter()


@router.post("/", response_model=AttendanceOut, status_code=status.HTTP_201_CREATED)
def create_attendance(attendance_in: AttendanceCreate, db: Session = Depends(get_db)):
    return attendance_service.create_attendance(db=db, attendance_in=attendance_in)


@router.put("/{attendance_id}", response_model=AttendanceOut)
def update_attendance(
    attendance_id: int, attendance_in: AttendanceUpdate, db: Session = Depends(get_db)
):
    return attendance_service.update_attendance(
        db=db, attendance_id=attendance_id, attendance_in=attendance_in
    )


@router.get("/", response_model=List[AttendanceOut])
def read_attendances(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return attendance_service.get_attendances(db, skip=skip, limit=limit)


@router.get("/student/{student_id}", response_model=List[AttendanceOut])
def read_attendances_by_student(student_id: int, db: Session = Depends(get_db)):
    return attendance_service.get_attendances_by_student(db, student_user_id=student_id)


@router.get("/date-range", response_model=List[AttendanceOut])
def read_attendances_by_date_range(
    start_date: datetime = Query(..., description="Start date for attendance records"),
    end_date: datetime = Query(..., description="End date for attendance records"),
    db: Session = Depends(get_db),
):
    return attendance_service.get_attendances_by_date_range(
        db, start_date=start_date, end_date=end_date
    )


@router.get("/{attendance_id}", response_model=AttendanceOut)
def read_attendance(attendance_id: int, db: Session = Depends(get_db)):
    return attendance_service.get_attendance(db, attendance_id=attendance_id)


@router.delete("/{attendance_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_attendance(attendance_id: int, db: Session = Depends(get_db)):
    return attendance_service.delete_attendance(db, attendance_id=attendance_id)
