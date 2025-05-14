from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.class_ import Class
from app.schemas.class_ import ClassCreate, ClassUpdate


def get_active_classes(db: Session):
    return db.query(Class).filter_by(deleted=False)


def get_class(db: Session, class_id: int) -> Optional[Class]:
    return get_active_classes(db).filter_by(id=class_id).first()


def get_classes(db: Session, skip: int = 0, limit: int = 100) -> list[Class]:
    return get_active_classes(db).offset(skip).limit(limit).all()


def get_classes_by_teacher(db: Session, teacher_user_id: int) -> list[Class]:
    return get_active_classes(db).filter_by(teacher_user_id=teacher_user_id).all()


def insert_class(db: Session, class_in: ClassCreate) -> Class:
    db_class = Class(
        name=class_in.name,
        teacher_user_id=class_in.teacher_user_id,
    )
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class


def update_class(db: Session, class_id: int, class_in: ClassUpdate) -> Class:
    db_class = get_class(db, class_id)
    if not db_class:
        raise ValueError(f"Class {class_id} not found")

    update_data = class_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_class, field, value)

    db.commit()
    db.refresh(db_class)
    return db_class


def soft_delete_class(db: Session, db_class: Class) -> None:
    db_class.deleted = True
    db.commit()
