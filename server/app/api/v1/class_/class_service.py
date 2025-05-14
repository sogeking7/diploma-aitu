from fastapi import HTTPException, status
from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.class_ import Class
from app.schemas.class_ import ClassCreate, ClassUpdate
from app.repositories import class_ as class_repo


def get_class(db: Session, class_id: int) -> Optional[Class]:
    db_class = class_repo.get_class(db, class_id=class_id)
    if db_class is None:
        raise HTTPException(status_code=404, detail="Class not found")
    return db_class


def get_classes(db: Session, skip: int = 0, limit: int = 100) -> List[Class]:
    return class_repo.get_classes(db, skip=skip, limit=limit)


def get_classes_by_teacher(db: Session, teacher_user_id: int) -> List[Class]:
    return class_repo.get_classes_by_teacher(db, teacher_user_id=teacher_user_id)


def create_class(db: Session, class_in: ClassCreate) -> Class:

    return class_repo.insert_class(db, class_in)


def update_class(db: Session, class_id: int, class_in: ClassUpdate) -> Class:
    try:
        return class_repo.update_class(db, class_id, class_in)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


def delete_class(db: Session, class_id: int) -> None:
    db_class = class_repo.get_class(db, class_id)
    if not db_class:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Class with id {class_id} not found",
        )

    class_repo.soft_delete_class(db, db_class)
