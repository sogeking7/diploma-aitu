from sqlalchemy.orm import Session
from app.schemas.notification import NotificationCreate, NotificationOut
from app.repositories import notification as notification_repo
from fastapi_pagination import Page
from app.models.notification import Notification


def get_notifications(db: Session) -> Page[NotificationOut]:
    return notification_repo.get_notifications(db)


def get_user_notifications(db: Session, user_id: int) -> Page[NotificationOut]:
    return notification_repo.get_notifications_by_user(db, user_id)


def create_user_notification(db: Session, notif: NotificationCreate) -> NotificationOut:
    return notification_repo.create_notification(db, notif)


def mark_notification_as_read(
    db: Session, notif_id: int, user_id: int
) -> NotificationOut:
    return notification_repo.mark_as_read(db, notif_id, user_id)
