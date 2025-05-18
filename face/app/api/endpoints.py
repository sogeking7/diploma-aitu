import time

from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from PIL import Image
import io
import numpy as np
from ..services.face_detector import FaceDetector
from ..services.face_database import FaceDatabase

router = APIRouter()

# Initialize services
face_detector = FaceDetector()
face_db = FaceDatabase()


@router.post("/verify")
async def verify_faces(img1: UploadFile = File(...), img2: UploadFile = File(...)):
    try:
        img1_pil = Image.open(io.BytesIO(await img1.read())).convert("RGB")
        img2_pil = Image.open(io.BytesIO(await img2.read())).convert("RGB")

        emb1 = face_detector.extract_embedding(img1_pil)
        emb2 = face_detector.extract_embedding(img2_pil)

        if emb1 is None or emb2 is None:
            raise HTTPException(status_code=400, detail="Face not detected in one or both images.")

        distance = np.linalg.norm(emb1 - emb2)
        match = distance < 0.8

        return {"match": bool(match), "distance": float(distance)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/add_face")
async def add_face(
        face_id: str = Form(...),
        name: str = Form(...),
        image: UploadFile = File(...)
):
    try:
        img_pil = Image.open(io.BytesIO(await image.read())).convert("RGB")
        embedding = face_detector.extract_embedding(img_pil)

        if embedding is None:
            raise HTTPException(status_code=400, detail="No face detected in the image")

        # Add to face database
        success = face_db.add_face(
            face_id=face_id,
            embedding=embedding[0],  # Get the actual vector
            metadata={"name": name}
        )

        if not success:
            raise HTTPException(status_code=400, detail=f"Face ID {face_id} already exists")

        return {"face_id": face_id, "status": "added successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/search_face")
async def search_face(
        image: UploadFile = File(...),
        threshold: float = Form(0.8),
        k: int = Form(1)
):
    try:
        img_pil = Image.open(io.BytesIO(await image.read())).convert("RGB")
        embedding = face_detector.extract_embedding(img_pil)

        if embedding is None:
            raise HTTPException(status_code=400, detail="No face detected in the image")

        # Search in database
        results = face_db.search_face(
            embedding=embedding[0],
            threshold=threshold,
            k=k
        )

        return {
            "matches": [
                {
                    "face_id": face_id,
                    "distance": distance,
                    "metadata": metadata
                } for face_id, distance, metadata in results
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delete_face/{face_id}")
async def delete_face(face_id: str):
    success = face_db.delete_face(face_id)

    if not success:
        raise HTTPException(status_code=404, detail=f"Face ID {face_id} not found")

    return {"face_id": face_id, "status": "deleted successfully"}


@router.get("/list_faces")
async def list_faces():
    faces = face_db.get_all_faces()
    return {"faces": faces}


@router.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    try:
        # Check if face detector is working
        device_info = face_detector.get_device_info()

        # Check if database is accessible
        db_size = face_db.index.ntotal if hasattr(face_db, 'index') else 0

        return {
            "status": "healthy",
            "device": device_info,
            "database_size": db_size,
            "timestamp": time.time()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": time.time()
        }