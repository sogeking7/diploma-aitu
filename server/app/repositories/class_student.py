from typing import Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

from app.models.class_student import ClassStudent
from app.schemas.class_student import (
    ClassStudentCreate,
    ClassStudentUpdate,
    ClassStudentOut,
)
from app.models.user import User


def get_active_class_students(db: Session):
    return (
        db.query(ClassStudent)
        .join(User, ClassStudent.student_user_id == User.id)
        .filter(ClassStudent.deleted == False, User.deleted == False)
        .options(joinedload(ClassStudent.student_user))
    )


def get_class_student(db: Session, class_student_id: int) -> Optional[ClassStudentOut]:
    db_class_student = (
        get_active_class_students(db)
        .filter(ClassStudent.id == class_student_id)
        .first()
    )
    if db_class_student:
        return ClassStudentOut.model_validate(db_class_student)
    return None


def get_class_students(db: Session) -> Page[ClassStudentOut]:
    return paginate(db, get_active_class_students(db))


def get_students_by_class(db: Session, class_id: int) -> Page[ClassStudentOut]:
    return paginate(
        db,
        get_active_class_students(db)
        .filter(ClassStudent.class_id == class_id)
        .order_by(User.first_name, User.last_name),
    )


def get_classes_by_student(db: Session, student_user_id: int) -> Page[ClassStudentOut]:
    return paginate(
        db,
        get_active_class_students(db).filter(
            ClassStudent.student_user_id == student_user_id
        ),
    )


def get_class_student_by_ids(
    db: Session, class_id: int, student_user_id: int
) -> Optional[ClassStudentOut]:
    db_class_student = (
        get_active_class_students(db)
        .filter(
            ClassStudent.class_id == class_id,
            ClassStudent.student_user_id == student_user_id,
        )
        .first()
    )
    if db_class_student:
        return ClassStudentOut.model_validate(db_class_student)
    return None


def insert_class_student(
    db: Session, class_student_in: ClassStudentCreate
) -> ClassStudentOut:

    existing = (
        db.query(ClassStudent)
        .join(User, ClassStudent.student_user_id == User.id)
        .filter(
            ClassStudent.class_id == class_student_in.class_id,
            ClassStudent.student_user_id == class_student_in.student_user_id,
        )
        .options(joinedload(ClassStudent.student_user))
        .first()
    )

    if existing:
        if existing.deleted:
            existing.deleted = False
            db.commit()
            db.refresh(existing)
            return ClassStudentOut.model_validate(existing)
        else:
            raise ValueError("This student is already enrolled in this class")

    db_class_student = ClassStudent(
        class_id=class_student_in.class_id,
        student_user_id=class_student_in.student_user_id,
    )
    db.add(db_class_student)
    db.commit()
    db_class_student = (
        get_active_class_students(db)
        .filter(ClassStudent.id == db_class_student.id)
        .first()
    )
    return ClassStudentOut.model_validate(db_class_student)


def update_class_student(
    db: Session, class_student_id: int, class_student_in: ClassStudentUpdate
) -> ClassStudentOut:
    db_class_student = (
        get_active_class_students(db)
        .filter(ClassStudent.id == class_student_id)
        .first()
    )
    if not db_class_student:
        raise ValueError(
            f"Class-Student relationship with id {class_student_id} not found"
        )

    update_data = class_student_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_class_student, field, value)

    try:
        db.commit()
        db_class_student = (
            get_active_class_students(db)
            .filter(ClassStudent.id == class_student_id)
            .first()
        )
        return ClassStudentOut.model_validate(db_class_student)
    except IntegrityError:
        db.rollback()
        raise ValueError("This student is already enrolled in this class")


def soft_delete_class_student(db: Session, class_student_id: int) -> None:
    class_student = (
        get_active_class_students(db)
        .filter(ClassStudent.id == class_student_id)
        .first()
    )
    if not class_student:
        raise ValueError(
            f"Class-Student relationship with id {class_student_id} not found"
        )
    class_student.deleted = True
    db.commit()
