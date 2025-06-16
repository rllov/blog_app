from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal
from model import UserModel, SignUpRequest, LoginRequest
import bcrypt


#test for production 19013
from model import Base
from database import engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "https://blog-app-fe-be.onrender.com", #render production
    "http://localhost:5173", #local development
    "http://localhost" #docker compose

]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
def read_root():
    return {"message": "Hello shmoe mama 123"}

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
    
    return {
        "message": "Login successful",
        "user": {
            "user_id": str(user.user_id),
            "username": user.username,
            "email": user.email
        }
    }