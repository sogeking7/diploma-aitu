from pydantic import BaseModel, Field
from datetime import datetime
import uuid


class SessionBase(BaseModel):
    user_id: int


class SessionCreate(SessionBase):
    pass


class SessionResponse(SessionBase):
    token: uuid.UUID
    created_at: datetime
    expires_at: datetime
