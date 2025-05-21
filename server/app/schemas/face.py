from pydantic import BaseModel, Field
from typing import List, Dict, Optional


class FaceMatch(BaseModel):
    face_id: str
    distance: float
    metadata: Dict


class SearchResponse(BaseModel):
    matches: List[FaceMatch]


class FaceResponse(BaseModel):
    face_id: str
    status: str


class FacesList(BaseModel):
    faces: Dict[str, Dict]
