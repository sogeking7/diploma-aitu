from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from fastapi_pagination import Page

from app.models.user import User
from app.api.dependencies import get_db, get_current_user, require_admin_role
from app.schemas.parent_student import (
    ParentStudentOut,
    ParentStudentCreate,
    ParentStudentUpdate,
)
from app.api.v1.parent_student import parent_student_service

router = APIRouter()


@router.post("/", response_model=ParentStudentOut, status_code=status.HTTP_201_CREATED)
def create_parent_student(
    parent_student_in: ParentStudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_role),
):
    return parent_student_service.create_parent_student(
        db=db, parent_student_in=parent_student_in
    )


@router.put("/{parent_student_id}", response_model=ParentStudentOut)
def update_parent_student(
    parent_student_id: int,
    parent_student_in: ParentStudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_role),
):
    return parent_student_service.update_parent_student(
        db=db, parent_student_id=parent_student_id, parent_student_in=parent_student_in
    )


@router.get("/", response_model=Page[ParentStudentOut])
def read_parent_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return parent_student_service.get_parent_students(db)


@router.get("/parent/{parent_id}", response_model=Page[ParentStudentOut])
def read_students_by_parent(
    parent_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return parent_student_service.get_students_by_parent(db, parent_user_id=parent_id)


@router.get("/student/{student_id}", response_model=Page[ParentStudentOut])
def read_parents_by_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return parent_student_service.get_parents_by_student(db, student_user_id=student_id)


@router.get("/{parent_student_id}", response_model=ParentStudentOut)
def read_parent_student(
    parent_student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return parent_student_service.get_parent_student(
        db, parent_student_id=parent_student_id
    )


@router.delete("/{parent_student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_parent_student(
    parent_student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_role),
):
    return parent_student_service.delete_parent_student(
        db, parent_student_id=parent_student_id
    )
