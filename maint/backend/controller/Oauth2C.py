from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from models.Oauth2Models import User as UserInDB, UserSchema, Token, UserCreateSchema, PasswordChangeSchema
from db.database import get_db
import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is not set")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 43200  # 30 days

# pwd_context removed in favor of direct bcrypt library calls
# Set auto_error=False so it doesn't 401 if header is missing, allowing us to check cookies
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token", auto_error=False)

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    # bcrypt.hashpw returns bytes, we decode to utf-8 for storage
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user(db: Session, username: str):
    return db.query(UserInDB).filter(UserInDB.username == username).first()

@router.post("/token")
async def login_for_access_token(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print(f"Login request for username: {form_data.username}")  # Debug log
    try:
        user = get_user(db, form_data.username)
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer", "Access-Control-Allow-Origin": "*"},
            )
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
        )
        
        # Set HttpOnly Cookie for access token
        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=True,
            secure=False, # Set to True in production with HTTPS
            samesite="lax",
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )

        # Set a plain cookie for the role (accessible by frontend middleware)
        response.set_cookie(
            key="user_role",
            value=user.role,
            httponly=False, # Must be accessible by middleware script if needed, or just for convenience
            secure=False,
            samesite="lax",
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
        return {
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "full_name": user.full_name,
                "email": user.email,
                "phone": user.phone,
                "role": user.role
            }
        }
    except Exception as e:
        print(f"Error in /auth/token: {str(e)}")  # Debug log
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("user_role")
    return {"message": "Logout successful"}

@router.post("/register", response_model=UserSchema)
async def register(user: UserCreateSchema, db: Session = Depends(get_db)):
    db_user = get_user(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check email uniqueness too if needed
    db_email = db.query(UserInDB).filter(UserInDB.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    new_user = UserInDB(
        username=user.username,
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_current_user(request: Request, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    # If token is not in header, try to get it from cookie
    if not token:
        cookie_token = request.cookies.get("access_token")
        if cookie_token:
            if cookie_token.startswith("Bearer "):
                token = cookie_token.split(" ")[1]
            else:
                token = cookie_token

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        raise credentials_exception

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        user = db.query(UserInDB).filter(UserInDB.username == username).first()
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception

@router.get("/users/me", response_model=UserSchema)
async def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    return current_user

@router.post("/change-password")
async def change_password(
    data: PasswordChangeSchema, 
    current_user: UserInDB = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Ancien mot de passe incorrect")
    
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Mot de passe modifié avec succès"}

@router.post("/toggle-2fa")
async def toggle_2fa(
    current_user: UserInDB = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    current_user.two_factor_enabled = 1 if not current_user.two_factor_enabled else 0
    db.commit()
    return {
        "message": "2FA mis à jour", 
        "two_factor_enabled": bool(current_user.two_factor_enabled)
    }