from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing_extensions import Optional

from app.api.dependencies import get_db, get_current_user, require_parent_role
from app.models.user import User
from app.schemas.notification import NotificationOut, NotificationCreate
from app.api.v1.notification import notification_service

router = APIRouter()


@router.post("/", response_model=NotificationOut)
def create_notification(
    notification_in: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent_role),
):
    return notification_service.create_notification(
        db, notification_in, current_user.id
    )
