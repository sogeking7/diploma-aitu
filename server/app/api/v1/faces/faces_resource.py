from fastapi import APIRouter, File, UploadFile, Form, Depends
from fastapi_pagination import Page
from sqlalchemy.orm import Session

from app.api.dependencies import get_face_detector, get_face_db, get_db
from app.schemas.face import FaceOut
from app.services.face_detector import FaceDetector
from app.services.face_db import FaceDatabase
from app.api.v1.faces import faces_service

router = APIRouter()


@router.post("/add_face")
async def add_face(
    user_id: int = Form(...),
    image: UploadFile = File(...),
    face_detector: FaceDetector = Depends(get_face_detector),
    face_db: FaceDatabase = Depends(get_face_db),
    db: Session = Depends(get_db),
):
    return await faces_service.add_face(db, face_detector, face_db, user_id, image)


@router.post("/search_face")
async def search_face(
    image: UploadFile = File(...),
    threshold: float = Form(0.8),
    k: int = Form(1),
    face_detector: FaceDetector = Depends(get_face_detector),
    face_db: FaceDatabase = Depends(get_face_db),
    db: Session = Depends(get_db),
):
    return await faces_service.search_face(
        db, face_detector, face_db, image, threshold, k
    )


@router.delete("/{face_id}")
def delete_face(
    face_id: int,
    face_db: FaceDatabase = Depends(get_face_db),
    db: Session = Depends(get_db),
):
    return faces_service.delete_face(db, face_db, face_id)


@router.get("/", response_model=Page[FaceOut])
def get_faces(
    db: Session = Depends(get_db),
):
    return faces_service.get_faces(db)


@router.get("/health")
async def health_check(
    face_detector: FaceDetector = Depends(get_face_detector),
    face_db: FaceDatabase = Depends(get_face_db),
):
    return await faces_service.health_check(face_detector, face_db)


@router.get("/{face_id}")
def read_face(
    face_id: int,
    db: Session = Depends(get_db),
):
    return faces_service.read_face(db, face_id)
