from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_current_user
from app.models.user import User, RoleEnum
from app.schemas.notification import NotificationOut, NotificationCreate
from app.api.v1.notification import notification_service
from fastapi_pagination import Page

router = APIRouter()


@router.get("/all", response_model=Page[NotificationOut])
def get_all_notifications(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str("Only admin can send notifications"),
        )
    return notification_service.get_notifications(db)


@router.get("/user", response_model=Page[NotificationOut])
def get_notifications_by_user(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    user_id = current_user.id
    return notification_service.get_user_notifications(db, user_id=user_id)


@router.post("/", response_model=NotificationOut)
def send_notification(
    notif: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str("Only admin can send notifications"),
        )
    return notification_service.create_user_notification(db, notif)


@router.put("/{notification_id}/read", response_model=NotificationOut)
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_id = current_user.id
    return notification_service.mark_notification_as_read(
        db, notification_id, user_id=user_id
    )
