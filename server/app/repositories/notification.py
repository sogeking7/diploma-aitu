from typing import List

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.schemas.notification import NotificationCreate, NotificationOut


def get_notifications_by_user(db: Session, user_id: int) -> List[type[NotificationOut]]:
    return db.query(Notification).filter_by(deleted=False, user_id=user_id).all()


def create_notification(
    db: Session, notification_in: NotificationCreate, user_id: int
) -> NotificationOut | None:
    db_notification = Notification(user_id=user_id, chat_id=notification_in.chat_id)
    try:
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
        return NotificationOut.model_validate(db_notification)
    except IntegrityError:
        db.rollback()
        print(f"Notification with chat_id {notification_in.chat_id} already exists.")
        return None
