from pydantic import BaseModel
from typing import List, Dict, Optional

from app.schemas.user import UserBase


class FaceMatch(BaseModel):
    face_id: int
    distance: float
    metadata: Dict


class SearchResponse(BaseModel):
    matches: List[FaceMatch]


class FaceResponse(BaseModel):
    face_id: int
    status: str


class FacesList(BaseModel):
    faces: Dict[str, Dict]


class FaceBase(BaseModel):
    user_id: int


class FaceOut(FaceBase):
    id: int
    # user: Optional[UserBase] = None
    model_config = {"from_attributes": True}


class FaceCreate(FaceBase):
    pass
