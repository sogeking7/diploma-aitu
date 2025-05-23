from typing import Optional

from pydantic import BaseModel
from datetime import datetime

from app.schemas.user import UserBase


class NotificationBase(BaseModel):
    user_id: int
    title: str
    body: Optional[str]


class NotificationCreate(NotificationBase):
    pass


class NotificationOut(NotificationBase):
    id: int
    is_read: bool
    user: Optional[UserBase]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
