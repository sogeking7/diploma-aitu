from typing import List, Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.schemas.notification import NotificationCreate, NotificationOut
from app.repositories import notification as notification_repo


def get_notifications_by_user(db: Session, user_id: int) -> List[type[NotificationOut]]:
    return notification_repo.get_notifications_by_user(db, user_id)


def create_notification(
    db: Session, notif: NotificationCreate, user_id: int
) -> Optional[NotificationOut]:
    new_notif = notification_repo.create_notification(db, notif, user_id)
    if new_notif is None:
        raise HTTPException(status_code=200, detail=f"You are already signed in")
    return new_notif
