from pydantic import BaseModel


class NotificationBase(BaseModel):
    user_id: int
    chat_id: int


class NotificationCreate(BaseModel):
    chat_id: int


class NotificationOut(NotificationBase):
    id: int

    class Config:
        from_attributes = True
