from fastapi import FastAPI, Response, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from db.database import Base, engine, get_db
from controller.settingsController import router as SettingsRouter
from controller.Oauth2C import router as Oauth2CRouter
from controller.vetineController import router as VetrineRouter
from controller.serviceController import router as ServiceRouter
from controller.ratingController import router as RatingRouter
from controller.fournisseur import router as supplier_router
from controller.site import router as SiteRouter
from controller.imagesUpload import router as ImagesUploadRouter
from controller.freelancer import router as FreelancerRouter
from controller.seoController import router as SEORouter
from controller.seoController import router as SEORouter
from controller.blogController import router as BlogRouter
from utils.seed_blogs import seed_blogs_if_empty
from db.database import SessionLocal

#venv\Scripts\uvicorn main:app --reload

# Initialize the rate limiter
from config.limiter_config import limiter

import os

# ... imports ...

app = FastAPI(redirect_slashes=False)
Base.metadata.create_all(bind=engine)

# Get CORS origins from environment variable
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:3005")
origins = [origin.strip() for origin in cors_origins_str.split(",") if origin.strip()]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    print(f"Unhandled error: {str(exc)}")  # Log the error for debugging
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)},
    )
# Add rate limiting middleware
app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    lambda request, exc: Response(content="Rate limit exceeded", status_code=429),
)
app.add_middleware(SlowAPIMiddleware)

# Include routers
app.include_router(Oauth2CRouter, prefix="/auth", tags=["Authentication"])
app.include_router(VetrineRouter, prefix="/vetrine", tags=["Vetrine"])
app.include_router(ServiceRouter, prefix="/service", tags=["Service"])
app.include_router(RatingRouter, prefix="/rating", tags=["Rating"])
app.include_router(SiteRouter, prefix="/site", tags=["Site"])
app.include_router(supplier_router, prefix="/fournisseur", tags=["Supplier"])
app.include_router(FreelancerRouter, prefix="/freelancers", tags=["Freelancer"])
app.include_router(SEORouter, prefix="/seo", tags=["SEO"])
app.include_router(BlogRouter, prefix="/blogs", tags=["Blog"])

# Quotations
from controller import quotationController
app.include_router(quotationController.router, prefix="/quotations", tags=["quotations"])

from utils.auth import admin_only
app.include_router(SettingsRouter, prefix="/settings", tags=["Settings"])
app.include_router(ImagesUploadRouter, tags=["Images Upload"])

# Mount uploads (NOT under /api!)
app.mount("/uploads", StaticFiles(directory="/uploads"), name="uploads")

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    #Base.metadata.drop_all(bind=engine)  # Drop all tables on startup (for development)
    Base.metadata.create_all(bind=engine)
    
    # Check and seed blogs
    db = SessionLocal()
    seed_blogs_if_empty(db)
    db.close()

@app.get("/")
@limiter.limit("5/minute")
def read_root(request: Request, db=Depends(get_db)):
    return {"message": "Not allowed here."}
