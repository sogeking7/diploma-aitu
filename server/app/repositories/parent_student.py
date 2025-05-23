from typing import Optional
from sqlalchemy.orm import Session, joinedload, aliased
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

from app.models import User
from app.models.parent_student import ParentStudent
from app.schemas.parent_student import (
    ParentStudentCreate,
    ParentStudentUpdate,
    ParentStudentOut,
)


def get_active_parent_students(db: Session):
    StudentUser = aliased(User)
    ParentUser = aliased(User)

    return (
        db.query(ParentStudent)
        .join(StudentUser, ParentStudent.student_user_id == StudentUser.id)
        .join(ParentUser, ParentStudent.parent_user_id == ParentUser.id, isouter=True)
        .filter(
            ParentStudent.deleted == False,
            StudentUser.deleted == False,
            ParentUser.deleted == False,
        )
        .options(
            joinedload(ParentStudent.student_user),
            joinedload(ParentStudent.parent_user),
        )
    )


def get_parent_student(
    db: Session, parent_student_id: int
) -> Optional[ParentStudentOut]:
    db_parent_student = (
        get_active_parent_students(db)
        .filter(ParentStudent.id == parent_student_id)
        .first()
    )
    if db_parent_student:
        return ParentStudentOut.model_validate(db_parent_student, from_attributes=True)
    return None


def get_parent_students(db: Session) -> Page[ParentStudentOut]:
    return paginate(db, get_active_parent_students(db))


def get_students_by_parent(db: Session, parent_user_id: int) -> Page[ParentStudentOut]:
    return paginate(
        db,
        get_active_parent_students(db).filter(
            ParentStudent.parent_user_id == parent_user_id
        ),
    )


def get_parents_by_student(db: Session, student_user_id: int) -> Page[ParentStudentOut]:
    return paginate(
        db,
        get_active_parent_students(db).filter(
            ParentStudent.student_user_id == student_user_id
        ),
    )


def get_parent_student_by_ids(
    db: Session, parent_user_id: int, student_user_id: int
) -> Optional[ParentStudentOut]:
    db_parent_student = (
        get_active_parent_students(db)
        .filter(
            ParentStudent.parent_user_id == parent_user_id,
            ParentStudent.student_user_id == student_user_id,
        )
        .first()
    )
    if db_parent_student:
        return ParentStudentOut.model_validate(db_parent_student, from_attributes=True)
    return None


def insert_parent_student(
    db: Session, parent_student_in: ParentStudentCreate
) -> ParentStudentOut:
    existing = (
        db.query(ParentStudent)
        .filter_by(
            parent_user_id=parent_student_in.parent_user_id,
            student_user_id=parent_student_in.student_user_id,
        )
        .first()
    )
    if existing:
        if existing.deleted:
            # Reactivate the soft-deleted record
            existing.deleted = False
            db.commit()
            db.refresh(existing)
            return ParentStudentOut.model_validate(existing, from_attributes=True)
    else:
        raise ValueError("This student is already enrolled in this class")

    db_parent_student = ParentStudent(
        parent_user_id=parent_student_in.parent_user_id,
        student_user_id=parent_student_in.student_user_id,
    )
    db.add(db_parent_student)
    db.commit()
    db_parent_student = (
        get_active_parent_students(db)
        .filter(ParentStudent.id == db_parent_student.id)
        .first()
    )
    return ParentStudentOut.model_validate(db_parent_student, from_attributes=True)


def update_parent_student(
    db: Session, parent_student_id: int, parent_student_in: ParentStudentUpdate
) -> ParentStudentOut:
    db_parent_student = (
        get_active_parent_students(db)
        .filter(ParentStudent.id == parent_student_id)
        .first()
    )
    if not db_parent_student:
        raise ValueError(
            f"Parent-Student relationship with id {parent_student_id} not found"
        )

    update_data = parent_student_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_parent_student, field, value)

    try:
        db.commit()
        db.refresh(db_parent_student)
        return ParentStudentOut.model_validate(db_parent_student, from_attributes=True)
    except IntegrityError:
        db.rollback()
        raise ValueError("This parent-student relationship already exists")


def soft_delete_parent_student(db: Session, parent_student_id: int) -> None:
    parent_student = (
        get_active_parent_students(db)
        .filter(ParentStudent.id == parent_student_id)
        .first()
    )
    if not parent_student:
        raise ValueError(
            f"Parent-Student relationship with id {parent_student_id} not found"
        )
    parent_student.deleted = True
    db.commit()
