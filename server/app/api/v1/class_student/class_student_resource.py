from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from fastapi_pagination import Page

from app.models.user import User
from app.api.dependencies import get_db, get_current_user, require_admin_role
from app.schemas.class_student import (
    ClassStudentOut,
    ClassStudentCreate,
    ClassStudentUpdate,
)
from app.api.v1.class_student import class_student_service

router = APIRouter()


@router.post("/", response_model=ClassStudentOut, status_code=status.HTTP_201_CREATED)
def create_class_student(
    class_student_in: ClassStudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_role),
):
    return class_student_service.create_class_student(
        db=db, class_student_in=class_student_in
    )


@router.put("/{class_student_id}", response_model=ClassStudentOut)
def update_class_student(
    class_student_id: int,
    class_student_in: ClassStudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_role),
):
    return class_student_service.update_class_student(
        db=db, class_student_id=class_student_id, class_student_in=class_student_in
    )


@router.get("/", response_model=Page[ClassStudentOut])
def read_class_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return class_student_service.get_class_students(db)


@router.get("/class/{class_id}", response_model=Page[ClassStudentOut])
def read_students_by_class(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return class_student_service.get_students_by_class(db, class_id=class_id)


@router.get("/student/{student_id}", response_model=Page[ClassStudentOut])
def read_classes_by_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return class_student_service.get_classes_by_student(db, student_user_id=student_id)


@router.get("/{class_student_id}", response_model=ClassStudentOut)
def read_class_student(
    class_student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return class_student_service.get_class_student(
        db, class_student_id=class_student_id
    )


@router.delete("/{class_student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_class_student(
    class_student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_role),
):
    return class_student_service.delete_class_student(
        db, class_student_id=class_student_id
    )
