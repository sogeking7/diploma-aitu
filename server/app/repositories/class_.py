from typing import Optional
from sqlalchemy import func
from fastapi_pagination import Page
from sqlalchemy.orm import Session, joinedload
from app.models.class_ import Class
from app.models.user import User
from app.models.class_student import ClassStudent
from app.schemas.class_ import ClassCreate, ClassUpdate, ClassOut
from fastapi_pagination.ext.sqlalchemy import paginate


def get_enrolled_students_count(db: Session, class_id: int) -> int:
    return (
        db.query(ClassStudent)
        .join(User, ClassStudent.student_user_id == User.id)
        .filter(
            ClassStudent.class_id == class_id,
            ClassStudent.deleted == False,
            User.deleted == False,
        )
        .count()
    )


def get_active_classes(db: Session):
    return (
        db.query(Class)
        .join(User, Class.teacher_user_id == User.id)
        .filter(Class.deleted == False, User.deleted == False)
        .options(joinedload(Class.teacher_user))
    )


def get_class(db: Session, class_id: int) -> Optional[ClassOut]:
    class_obj = get_active_classes(db).filter(Class.id == class_id).first()
    if class_obj:
        count = get_enrolled_students_count(db, class_id)
        class_dict = vars(class_obj)
        class_dict["enrolled_students_count"] = count
        class_dict["teacher_user"] = class_obj.teacher_user
        return ClassOut.model_validate(class_dict)
    return None


def get_classes(db: Session) -> Page[ClassOut]:
    # Получаем страницу с ORM объектами Class (включая teacher_user)
    base_query = get_active_classes(db)
    page = paginate(db, base_query)

    class_ids = [cls.id for cls in page.items]

    # Считаем студентов одним запросом
    counts = (
        db.query(ClassStudent.class_id, func.count().label("count"))
        .filter(ClassStudent.class_id.in_(class_ids), ClassStudent.deleted == False)
        .group_by(ClassStudent.class_id)
        .all()
    )

    # Преобразуем в dict: {class_id: count}
    count_map = {class_id: count for class_id, count in counts}

    # Собираем ClassOut объекты
    result_items = []
    for cls in page.items:
        result_items.append(
            ClassOut(
                id=cls.id,
                name=cls.name,
                teacher_user_id=cls.teacher_user_id,
                teacher_user=cls.teacher_user,
                enrolled_students_count=count_map.get(cls.id, 0),
            )
        )

    return Page(
        items=result_items,
        total=page.total,
        page=page.page,
        size=page.size,
    )


def get_classes_by_teacher(db: Session, teacher_user_id: int) -> Page[ClassOut]:
    query = get_active_classes(db)
    if teacher_user_id is not None:
        query = query.filter(Class.teacher_user_id == teacher_user_id)

    page = paginate(db, query)

    class_ids = [cls.id for cls in page.items]

    counts = (
        db.query(ClassStudent.class_id, func.count().label("count"))
        .filter(ClassStudent.class_id.in_(class_ids), ClassStudent.deleted == False)
        .group_by(ClassStudent.class_id)
        .all()
    )
    count_map = {class_id: count for class_id, count in counts}

    result_items = []
    for cls in page.items:
        result_items.append(
            ClassOut(
                id=cls.id,
                name=cls.name,
                teacher_user_id=cls.teacher_user_id,
                teacher_user=cls.teacher_user,
                enrolled_students_count=count_map.get(cls.id, 0),
            )
        )

    return Page(
        items=result_items,
        total=page.total,
        page=page.page,
        size=page.size,
    )


def insert_class(db: Session, class_in: ClassCreate) -> ClassOut:
    db_class = Class(
        name=class_in.name,
        teacher_user_id=class_in.teacher_user_id,
    )
    db.add(db_class)
    db.commit()
    db.refresh(db_class)

    # New class has 0 enrolled students
    setattr(db_class, "enrolled_students_count", 0)
    return ClassOut.model_validate(db_class)


def update_class(db: Session, class_id: int, class_in: ClassUpdate) -> ClassOut:
    db_class = get_active_classes(db).filter(Class.id == class_id).first()
    if not db_class:
        raise ValueError(f"Class {class_id} not found")

    update_data = class_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_class, field, value)

    db.commit()
    db.refresh(db_class)

    # Add enrolled students count
    count = get_enrolled_students_count(db, class_id)
    setattr(db_class, "enrolled_students_count", count)
    return ClassOut.model_validate(db_class)


def soft_delete_class(db: Session, class_id: int) -> None:
    class_ = get_active_classes(db).filter(Class.id == class_id).first()
    if not class_:
        raise ValueError(f"Class {class_id} not found")
    class_.deleted = True
    db.commit()
