from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine
from app.models import User, Attendance, Class, ClassStudent, ParentStudent
from app.api.v1.user import user_resource
from app.api.v1.auth import auth_resource
from app.api.v1.class_ import class_resource
from app.api.v1.attendance import attendance_resource
from app.api.v1.class_student import class_student_resource
from app.api.v1.parent_student import parent_student_resource
from app.api.utils.exception_handlers import add_exception_handlers
from app.core.logger import get_logger

from fastapi.security import OAuth2PasswordBearer

import uvicorn

logger = get_logger("app.main")

User.metadata.create_all(bind=engine)
Attendance.metadata.create_all(bind=engine)
Class.metadata.create_all(bind=engine)
ClassStudent.metadata.create_all(bind=engine)
ParentStudent.metadata.create_all(bind=engine)

app = FastAPI(
    title="Diploma FastAPI",
    version="1.0.0",
    swagger_ui_parameters={"persistAuthorization": True},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="api/v1/auth/login", scheme_name="bearerAuth", auto_error=False
)

app.include_router(auth_resource.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(
    user_resource.router,
    prefix="/api/v1/users",
    tags=["users"],
    dependencies=[Depends(oauth2_scheme)],
)
app.include_router(
    class_resource.router,
    prefix="/api/v1/classes",
    tags=["classes"],
    dependencies=[Depends(oauth2_scheme)],
)
app.include_router(
    attendance_resource.router,
    prefix="/api/v1/attendances",
    tags=["attendances"],
    dependencies=[Depends(oauth2_scheme)],
)
app.include_router(
    class_student_resource.router,
    prefix="/api/v1/class-students",
    tags=["class-students"],
    dependencies=[Depends(oauth2_scheme)],
)
app.include_router(
    parent_student_resource.router,
    prefix="/api/v1/parent-students",
    tags=["parent-students"],
    dependencies=[Depends(oauth2_scheme)],
)

add_exception_handlers(app)


@app.get("/health", tags=["health"])
def health():
    return {"status": "OK"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
