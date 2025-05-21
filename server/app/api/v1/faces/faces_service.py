import io
import time

from PIL import Image
from fastapi import HTTPException, UploadFile
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

    new_face: FaceOut = await face_repo.insert_face(db, FaceCreate(user_id=user_id))

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
        img_pil = Image.open(io.BytesIO(await image.read())).convert("RGB")
        embedding = face_detector.extract_embedding(img_pil)

        if embedding is None:
            raise HTTPException(status_code=400, detail="No face detected in the image")

        # Search in database
        raw_results = face_db.search_face(
            embedding=embedding[0], threshold=threshold, k=k
        )

        matches = [
            {
                "face_id": int(face_id),  # Convert numpy.int64 to regular Python int
                "distance": float(distance),
                "metadata": metadata,
            }
            for face_id, distance, metadata in raw_results
        ]

        return {"matches": matches}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def delete_face(db: Session, face_db: FaceDatabase, face_id: int):
    success = face_db.delete_face(face_id)

    if not success:
        raise HTTPException(status_code=404, detail=f"Face ID {face_id} not found")

    return {"face_id": face_id, "status": "deleted successfully"}


async def list_faces(db: Session, face_db: FaceDatabase):
    faces_metadata = face_db.get_all_faces()

    result = [
        {
            "face_id": int(face_id),
            "user_id": int(metadata.get("user_id")) if "user_id" in metadata else None,
        }
        for face_id, metadata in faces_metadata.items()
    ]

    return result


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
