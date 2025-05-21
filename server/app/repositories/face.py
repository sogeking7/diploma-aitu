from typing import Optional

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
        .options(joinedload(Face.user))
    )


def get_face(db: Session, face_id: int) -> Optional[FaceOut]:
    db_face = get_active_faces(db).filter(Face.id == face_id).first()
    if db_face:
        return FaceOut.model_validate(db_face, from_attributes=True)
    return None


def get_faces(
    db: Session,
    user_id: Optional[int] = None,
) -> Page[FaceOut]:
    query = get_active_faces(db)
    if user_id:
        query = query.filter(Face.user_id == user_id)
    page = paginate(db, query)
    page.items = [
        FaceOut.model_validate(face, from_attributes=True) for face in page.items
    ]
    return page


def insert_face(db: Session, face_in: FaceCreate) -> Optional[FaceOut]:
    face = Face(
        user_id=face_in.user_id,
    )
    db.add(face)
    db.commit()
    db.refresh(face)

    return get_face(db, face.id)


def delete_face(db: Session, face_id: int) -> None:
    face = db.query(Face).filter(Face.id == face_id).first()
    if not face:
        raise ValueError(f"Face {face_id} not found")
    db.delete(face)
    db.commit()
