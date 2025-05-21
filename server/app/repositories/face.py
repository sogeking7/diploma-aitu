from typing import Optional, List, Any

from fastapi_pagination import Page
from sqlalchemy.orm import Session, joinedload

from app.models import User
from app.models.faces import Face
from app.schemas.face import FaceOut, FaceCreate
from fastapi_pagination.ext.sqlalchemy import paginate


def get_active_faces(db: Session):
    return (
        db.query(Face)
        .join(User, Face.user_id == User.id)
        .filter(Face.deleted == False)
        .options(joinedload(Face.user))
    )


def get_face(db: Session, face_id: int):
    return get_active_faces(db).filter_by(id=face_id).first()


def get_faces(
    db: Session,
    user_id: Optional[int] = None,
) -> Page[FaceOut]:
    query = get_active_faces(db)
    if user_id:
        query = query.filter(Face.user_id == user_id)
    return paginate(db, query)


async def insert_face(db: Session, face_in: FaceCreate) -> FaceOut:
    face = Face(
        user_id=face_in.user_id,
    )
    db.add(face)
    db.commit()
    db.refresh(face)

    return FaceOut.model_validate(face)


def soft_delete_face(db: Session, face_id: int) -> None:
    face = get_active_faces(db).filter_by(id=face_id).first()
    if not face:
        raise ValueError(f"Face {face_id} not found")
    face.deleted = True
    db.commit()
