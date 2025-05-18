import os
from fastapi import FastAPI
from app.api.endpoints import router

# Set environment variables
os.environ['PYTORCH_ENABLE_MPS_FALLBACK'] = '1'

app = FastAPI(title="Face Recognition API", docs_url="/docs", redoc_url="/redoc")

# Include API router
app.include_router(router)

@app.get("/")
def root():
    return {"status": "Face API is running!"}
