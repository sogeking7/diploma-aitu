from pydantic import BaseModel
from typing import List, Dict, Optional

from app.schemas.user import UserBase


class FaceBase(BaseModel):
    user_id: int


class FaceOut(FaceBase):
    id: int
    user: Optional[UserBase]
    model_config = {"from_attributes": True}


class FaceCreate(FaceBase):
    pass


class SearchFaceMatch(BaseModel):
    face: FaceOut
    distance: float
