import io
import time

from PIL import Image
from fastapi import HTTPException, UploadFile
from fastapi_pagination import Page
from sqlalchemy.orm import Session

from app.schemas.face import FaceCreate, FaceOut
from app.services.face_db import FaceDatabase
from app.services.face_detector import FaceDetector
from app.repositories import face as face_repo


async def add_face(
    db: Session,
    face_detector: FaceDetector,
    face_db: FaceDatabase,
    user_id: int,
    image: UploadFile,
):
    img_pil = Image.open(io.BytesIO(await image.read())).convert("RGB")
    embedding = face_detector.extract_embedding(img_pil)

    if embedding is None:
        raise HTTPException(status_code=400, detail="No face detected in the image")

    new_face: FaceOut = face_repo.insert_face(db, FaceCreate(user_id=user_id))

    success = face_db.add_face(
        face_id=new_face.id,
        embedding=embedding[0],
        metadata={"user_id": user_id},
    )

    if not success:
        raise HTTPException(
            status_code=400, detail=f"Face ID {new_face.id} already exists"
        )

    return {"face_id": new_face.id, "status": "added successfully"}


async def search_face(
    db: Session,
    face_detector: FaceDetector,
    face_db: FaceDatabase,
    image: UploadFile,
    threshold: float = 0.8,
    k: int = 1,
):
    try:
        img_bytes = await image.read()
        img_pil = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        embedding = face_detector.extract_embedding(img_pil)

        if embedding is None:
            raise HTTPException(status_code=400, detail="No face detected in the image")

        raw_results = face_db.search_face(
            embedding=embedding[0], threshold=threshold, k=k
        )

        matches = [
            {
                "face": face_repo.get_face(db, int(face_id)),
                "distance": float(distance),
            }
            for face_id, distance, metadata in raw_results
        ]

        return matches[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def delete_face(db: Session, face_db: FaceDatabase, face_id: int):
    success = face_db.delete_face(face_id)

    if not success:
        raise HTTPException(status_code=404, detail=f"Face ID {face_id} not found")
    else:
        face_repo.delete_face(db, face_id)
    return {"face_id": face_id, "status": "deleted successfully"}


def get_faces(db: Session) -> Page[FaceOut]:
    return face_repo.get_faces(db)


async def health_check(
    face_detector: FaceDetector,
    face_db: FaceDatabase,
):
    try:
        device_info = face_detector.get_device_info()

        db_size = face_db.index.ntotal if hasattr(face_db, "index") else 0

        return {
            "status": "healthy",
            "device": device_info,
            "database_size": db_size,
            "timestamp": time.time(),
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e), "timestamp": time.time()}


def read_face(db: Session, face_id: int):
    return face_repo.get_face(db, face_id)
