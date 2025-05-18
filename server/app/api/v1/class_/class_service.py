from fastapi import HTTPException, status
from typing import Optional, List

from fastapi_pagination import Page
from sqlalchemy.orm import Session

from app.models.class_ import Class
from app.schemas.class_ import ClassCreate, ClassUpdate, ClassOut
from app.repositories import class_ as class_repo


def get_class(db: Session, class_id: int) -> Optional[ClassOut]:
    db_class = class_repo.get_class(db, class_id=class_id)
    if db_class is None:
        raise HTTPException(status_code=404, detail="Class not found")
    return db_class


def get_classes(db: Session) -> Page[ClassOut]:
    return class_repo.get_classes(db)


def get_classes_by_teacher(db: Session, teacher_user_id: int) -> Page[ClassOut]:
    return class_repo.get_classes_by_teacher(db, teacher_user_id=teacher_user_id)


def create_class(db: Session, class_in: ClassCreate) -> ClassOut:
    return class_repo.insert_class(db, class_in)


def update_class(db: Session, class_id: int, class_in: ClassUpdate) -> ClassOut:
    try:
        return class_repo.update_class(db, class_id, class_in)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


def delete_class(db: Session, class_id: int) -> None:
    class_repo.soft_delete_class(db, class_id)
