from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.models.parent_student import ParentStudent
from app.schemas.parent_student import ParentStudentCreate, ParentStudentUpdate


def get_active_parent_students(db: Session):
    return db.query(ParentStudent).filter_by(deleted=False)


def get_parent_student(db: Session, parent_student_id: int) -> Optional[ParentStudent]:
    return get_active_parent_students(db).filter_by(id=parent_student_id).first()


def get_parent_students(
    db: Session, skip: int = 0, limit: int = 100
) -> list[ParentStudent]:
    return get_active_parent_students(db).offset(skip).limit(limit).all()


def get_students_by_parent(db: Session, parent_user_id: int) -> list[ParentStudent]:
    return get_active_parent_students(db).filter_by(parent_user_id=parent_user_id).all()


def get_parents_by_student(db: Session, student_user_id: int) -> list[ParentStudent]:
    return (
        get_active_parent_students(db).filter_by(student_user_id=student_user_id).all()
    )


def get_parent_student_by_ids(
    db: Session, parent_user_id: int, student_user_id: int
) -> Optional[ParentStudent]:
    return (
        get_active_parent_students(db)
        .filter_by(parent_user_id=parent_user_id, student_user_id=student_user_id)
        .first()
    )


def insert_parent_student(
    db: Session, parent_student_in: ParentStudentCreate
) -> ParentStudent:
    try:
        db_parent_student = ParentStudent(
            parent_user_id=parent_student_in.parent_user_id,
            student_user_id=parent_student_in.student_user_id,
        )
        db.add(db_parent_student)
        db.commit()
        db.refresh(db_parent_student)
        return db_parent_student
    except IntegrityError:
        db.rollback()
        raise ValueError("This parent-student relationship already exists")


def update_parent_student(
    db: Session, parent_student_id: int, parent_student_in: ParentStudentUpdate
) -> ParentStudent:
    db_parent_student = get_parent_student(db, parent_student_id)
    if not db_parent_student:
        raise ValueError(
            f"Parent-Student relationship with id {parent_student_id} not found"
        )

    update_data = parent_student_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_parent_student, field, value)

    try:
        db.commit()
        db.refresh(db_parent_student)
        return db_parent_student
    except IntegrityError:
        db.rollback()
        raise ValueError("This parent-student relationship already exists")


def soft_delete_parent_student(db: Session, db_parent_student: ParentStudent) -> None:
    db_parent_student.deleted = True
    db.commit()
