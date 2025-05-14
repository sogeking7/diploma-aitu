from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.api.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.class_ import ClassOut, ClassCreate, ClassUpdate
from app.api.v1.class_ import class_service

router = APIRouter()


@router.post("/", response_model=ClassOut, status_code=status.HTTP_201_CREATED)
def create_class(
    class_in: ClassCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return class_service.create_class(db=db, class_in=class_in)


@router.put("/{class_id}", response_model=ClassOut)
def update_class(
    class_id: int,
    class_in: ClassUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return class_service.update_class(db=db, class_id=class_id, class_in=class_in)


@router.get("/", response_model=List[ClassOut])
def read_classes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return class_service.get_classes(db, skip=skip, limit=limit)


@router.get("/teacher/{teacher_id}", response_model=List[ClassOut])
def read_classes_by_teacher(
    teacher_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return class_service.get_classes_by_teacher(db, teacher_user_id=teacher_id)


@router.get("/{class_id}", response_model=ClassOut)
def read_class(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return class_service.get_class(db, class_id=class_id)


@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_class(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return class_service.delete_class(db, class_id=class_id)
