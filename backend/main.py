from fastapi import FastAPI, HTTPException, status, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import SessionLocal
from auth import decode_access_token, create_access_token
from model import UserModel, SignUpRequest, LoginRequest
import bcrypt


#test for production 19013
from model import Base
from database import engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

# FASTAPI security for OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "/login")  # Placeholder for OAuth2 scheme if needed



origins = [
    "https://blog-app-fe-be.onrender.com", #frontend production server
    "https://blog-app-y08k.onrender.com", #backend production server
    "http://localhost:5173", #local development
    "http://localhost" #docker compose
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Backend is running"}

#public endpoints for signup and login
@app.post("/signup")
def signup(request: SignUpRequest, db: Session = Depends(get_db)):
    existing_user = db.query(UserModel).filter(
        (UserModel.username == request.username) | (UserModel.email == request.email)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )

    # Hash the password (fix: encode to bytes)
    hashed_password = bcrypt.hashpw(request.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = UserModel(username=request.username, email=request.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "message": "User created successfully", 
        "user": {
            "user_id": str(new_user.user_id),
            "username": new_user.username,
            "email": new_user.email
        }
    }

@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(
        (UserModel.username == request.username_or_email) | (UserModel.email == request.username_or_email)
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check password
    if not bcrypt.checkpw(request.password.encode('utf-8'), user.hashed_password.encode('utf-8')):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )
    
    #creating access token jwt
    access_token = create_access_token(data={"sub": str(user.user_id), "username": user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "message": "Login successful",
        "user": {
            "user_id": str(user.user_id),
            "username": user.username,
            "email": user.email
        }
    }

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = payload.get("sub")
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# Protected endpoints that require authentication
auth_router = APIRouter(prefix="/auth") # allows for routing of auth related endpoints
@auth_router.get("/home")
def read_users_me(current_user: UserModel = Depends(get_current_user)):
    return {
        "message": f"Welcome {current_user.username}!",
        "user_id": str(current_user.user_id),
        "username": current_user.username,
        "email": current_user.email
    }

# @auth_router.get("/posts")
# def read_posts(current_user: UserModel = Depends(get_current_user)):
#     return {
#         "message": f"Here are your posts, {current_user.username}!",
#         "user_id": str(current_user.user_id),
#         "username": current_user.username,
#         "email": current_user.email
#     }
app.include_router(auth_router)
