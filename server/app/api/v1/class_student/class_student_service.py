from fastapi import HTTPException, status
from typing import Optional
from sqlalchemy.orm import Session
from fastapi_pagination import Page

from app.schemas.class_student import ClassStudentCreate, ClassStudentUpdate, ClassStudentOut
from app.repositories import class_student as class_student_repo


def get_class_student(db: Session, class_student_id: int) -> Optional[ClassStudentOut]:
    db_class_student = class_student_repo.get_class_student(
        db, class_student_id=class_student_id
    )
    if db_class_student is None:
        raise HTTPException(
            status_code=404, detail="Class-Student relationship not found"
        )
    return db_class_student


def get_class_students(
    db: Session
) -> Page[ClassStudentOut]:
    return class_student_repo.get_class_students(db)


def get_students_by_class(db: Session, class_id: int) -> Page[ClassStudentOut]:
    return class_student_repo.get_students_by_class(db, class_id=class_id)


def get_classes_by_student(db: Session, student_user_id: int) -> Page[ClassStudentOut]:
    return class_student_repo.get_classes_by_student(
        db, student_user_id=student_user_id
    )


def create_class_student(
    db: Session, class_student_in: ClassStudentCreate
) -> ClassStudentOut:
    try:
        return class_student_repo.insert_class_student(db, class_student_in)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


def update_class_student(
    db: Session, class_student_id: int, class_student_in: ClassStudentUpdate
) -> ClassStudentOut:
    try:
        return class_student_repo.update_class_student(
            db, class_student_id, class_student_in
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


def delete_class_student(db: Session, class_student_id: int) -> None:
    try:
        class_student_repo.soft_delete_class_student(db, class_student_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


def get_class_student_by_ids(
    db: Session, class_id: int, student_user_id: int
) -> Optional[ClassStudentOut]:
    db_class_student = class_student_repo.get_class_student_by_ids(
        db, class_id, student_user_id
    )
    if not db_class_student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Class-Student relationship for class {class_id} and student {student_user_id} not found",
        )
    return db_class_student
