from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.models.class_student import ClassStudent
from app.schemas.class_student import ClassStudentCreate, ClassStudentUpdate


def get_active_class_students(db: Session):
    return db.query(ClassStudent).filter_by(deleted=False)


def get_class_student(db: Session, class_student_id: int) -> Optional[ClassStudent]:
    return get_active_class_students(db).filter_by(id=class_student_id).first()


def get_class_students(
    db: Session, skip: int = 0, limit: int = 100
) -> list[ClassStudent]:
    return get_active_class_students(db).offset(skip).limit(limit).all()


def get_students_by_class(db: Session, class_id: int) -> list[ClassStudent]:
    return get_active_class_students(db).filter_by(class_id=class_id).all()


def get_classes_by_student(db: Session, student_user_id: int) -> list[ClassStudent]:
    return (
        get_active_class_students(db).filter_by(student_user_id=student_user_id).all()
    )


def get_class_student_by_ids(
    db: Session, class_id: int, student_user_id: int
) -> Optional[ClassStudent]:
    return (
        get_active_class_students(db)
        .filter_by(class_id=class_id, student_user_id=student_user_id)
        .first()
    )


def insert_class_student(
    db: Session, class_student_in: ClassStudentCreate
) -> ClassStudent:
    try:
        db_class_student = ClassStudent(
            class_id=class_student_in.class_id,
            student_user_id=class_student_in.student_user_id,
        )
        db.add(db_class_student)
        db.commit()
        db.refresh(db_class_student)
        return db_class_student
    except IntegrityError:
        db.rollback()
        raise ValueError("This student is already enrolled in this class")


def update_class_student(
    db: Session, class_student_id: int, class_student_in: ClassStudentUpdate
) -> ClassStudent:
    db_class_student = get_class_student(db, class_student_id)
    if not db_class_student:
        raise ValueError(
            f"Class-Student relationship with id {class_student_id} not found"
        )

    update_data = class_student_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_class_student, field, value)

    try:
        db.commit()
        db.refresh(db_class_student)
        return db_class_student
    except IntegrityError:
        db.rollback()
        raise ValueError("This student is already enrolled in this class")


def soft_delete_class_student(db: Session, db_class_student: ClassStudent) -> None:
    db_class_student.deleted = True
    db.commit()
