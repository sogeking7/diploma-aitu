from typing import Optional

from fastapi_pagination import Page
from sqlalchemy.orm import Session, joinedload
from app.models.class_ import Class
from app.models.user import User
from app.schemas.class_ import ClassCreate, ClassUpdate, ClassOut
from fastapi_pagination.ext.sqlalchemy import paginate


def get_active_classes(db: Session):
    return (
        db.query(Class)
        .join(User, Class.teacher_user_id == User.id)
        .filter(Class.deleted == False)
        .options(joinedload(Class.teacher_user))
    )


def get_class(db: Session, class_id: int) -> Optional[ClassOut]:
    return get_active_classes(db).filter(Class.id == class_id).first()


def get_classes(db: Session) -> Page[ClassOut]:
    return paginate(db, get_active_classes(db))


def get_classes_by_teacher(db: Session, teacher_user_id: int) -> Page[ClassOut]:
    return paginate(
        db, get_active_classes(db).filter_by(teacher_user_id=teacher_user_id)
    )


def insert_class(db: Session, class_in: ClassCreate) -> ClassOut:
    db_class = Class(
        name=class_in.name,
        teacher_user_id=class_in.teacher_user_id,
    )
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return ClassOut.model_validate(db_class)


def update_class(db: Session, class_id: int, class_in: ClassUpdate) -> ClassOut:
    db_class = get_active_classes(db).filter(Class.id == class_id).first()
    if not db_class:
        raise ValueError(f"Class {class_id} not found")

    update_data = class_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_class, field, value)

    db.commit()
    db.refresh(db_class)
    return ClassOut.model_validate(db_class)


def soft_delete_class(db: Session, class_id: int) -> None:
    class_ = get_active_classes(db).filter(Class.id == class_id).first()
    if not class_:
        raise ValueError(f"Class {class_id} not found")
    class_.deleted = True
    db.commit()
