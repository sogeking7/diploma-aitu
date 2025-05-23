from numpy.core.defchararray import title
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.models import User
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate, NotificationOut
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination import Page


def get_active_notifications(db: Session):
    return (
        db.query(Notification)
        .join(User, Notification.user_id == User.id)
        .filter(Notification.deleted == False, User.deleted == False)
        .options(joinedload(Notification.user))
        .order_by(Notification.created_at.desc())
    )


def get_notifications(db: Session) -> Page[NotificationOut]:
    query = get_active_notifications(db)
    return paginate(db, query)


def get_notifications_by_user(db: Session, user_id: int) -> Page[NotificationOut]:
    query = get_active_notifications(db).filter(Notification.user_id == user_id)
    return paginate(db, query)


def create_notification(
    db: Session, notification_in: NotificationCreate
) -> NotificationOut:
    db_notification = Notification(
        title=notification_in.title,
        body=notification_in.body,
        user_id=notification_in.user_id,
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification


def mark_as_read(db: Session, notification_id: int, user_id: int) -> NotificationOut:
    notification = (
        get_active_notifications(db)
        .filter(Notification.id == notification_id, Notification.user_id == user_id)
        .first()
    )
    if notification:
        notification.is_read = True
        db.commit()
        db.refresh(notification)
    return notification
