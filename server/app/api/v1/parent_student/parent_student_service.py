from fastapi import HTTPException, status
from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.parent_student import ParentStudent
from app.schemas.parent_student import ParentStudentCreate, ParentStudentUpdate
from app.repositories import parent_student as parent_student_repo


def get_parent_student(db: Session, parent_student_id: int) -> Optional[ParentStudent]:
    db_parent_student = parent_student_repo.get_parent_student(
        db, parent_student_id=parent_student_id
    )
    if db_parent_student is None:
        raise HTTPException(
            status_code=404, detail="Parent-Student relationship not found"
        )
    return db_parent_student


def get_parent_students(
    db: Session, skip: int = 0, limit: int = 100
) -> List[ParentStudent]:
    return parent_student_repo.get_parent_students(db, skip=skip, limit=limit)


def get_students_by_parent(db: Session, parent_user_id: int) -> List[ParentStudent]:
    return parent_student_repo.get_students_by_parent(db, parent_user_id=parent_user_id)


def get_parents_by_student(db: Session, student_user_id: int) -> List[ParentStudent]:
    return parent_student_repo.get_parents_by_student(
        db, student_user_id=student_user_id
    )


def create_parent_student(
    db: Session, parent_student_in: ParentStudentCreate
) -> ParentStudent:
    try:
        return parent_student_repo.insert_parent_student(db, parent_student_in)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


def update_parent_student(
    db: Session, parent_student_id: int, parent_student_in: ParentStudentUpdate
) -> ParentStudent:
    try:
        return parent_student_repo.update_parent_student(
            db, parent_student_id, parent_student_in
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


def delete_parent_student(db: Session, parent_student_id: int) -> None:
    db_parent_student = parent_student_repo.get_parent_student(db, parent_student_id)
    if not db_parent_student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parent-Student relationship with id {parent_student_id} not found",
        )

    parent_student_repo.soft_delete_parent_student(db, db_parent_student)


def get_parent_student_by_ids(
    db: Session, parent_user_id: int, student_user_id: int
) -> Optional[ParentStudent]:
    db_parent_student = parent_student_repo.get_parent_student_by_ids(
        db, parent_user_id, student_user_id
    )
    if not db_parent_student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parent-Student relationship for parent {parent_user_id} and student {student_user_id} not found",
        )
    return db_parent_student
