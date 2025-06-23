import uuid
from fastapi import FastAPI, HTTPException, status, Depends, APIRouter, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from database import SessionLocal
from auth import decode_access_token, create_access_token
from model import UserModel, SignUpRequest, LoginRequest, PostModel, CommentModel, LikeModel
import os
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

UPLOAD_DIR = "static/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)
@auth_router.post("/posts")
def create_post(
    text:str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    image_filename = None
    if image:
        image_filename = f"{uuid.uuid4()}_{image.filename}"
        with open(os.path.join(UPLOAD_DIR, image_filename), "wb") as buffer:
            buffer.write(image.file.read())
    post = PostModel(
        user_id=current_user.user_id,
        username=current_user.username,
        text=text,
        image_filename=image_filename,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return {
        "message": "Post created successfully",
        "post": {
            "post_id": str(post.post_id),
            "username": post.username,
            "text": post.text,
            "image_filename": post.image_filename,
            "created_at": post.created_at.isoformat() if post.created_at else None,
        }
    }


@auth_router.get("/posts")
def get_posts(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    posts = db.query(PostModel).order_by(PostModel.created_at.desc()).all()
    result = []
    for post in posts:
        likes_count = db.query(LikeModel).filter(LikeModel.post_id == post.post_id).count()
        comments_count = db.query(CommentModel).filter(CommentModel.post_id == post.post_id).count()
        result.append({
            "post_id": str(post.post_id),
            "user_id": str(post.user_id),
            "username": post.username,
            "text": post.text,
            "image_filename": post.image_filename,
            "created_at": post.created_at.isoformat() if post.created_at else None,
            "updated_at": post.updated_at.isoformat() if post.updated_at else None,
            "likes_count": likes_count,
            "comments_count": comments_count
        })
    return result
app.mount("/images", StaticFiles(directory=UPLOAD_DIR), name="images")

# Creating and Getting Comments
@auth_router.post("/posts/{post_id}/comments")
def create_comment(
    post_id: str,
    text: str = Form(...),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    post = db.query(PostModel).filter(PostModel.post_id == post_id).first()
    if not post:
        raise HTTPException(status_code = 404, detail = "Post not found")
    comment = CommentModel(
        post_id=post.post_id,
        user_id=current_user.user_id,
        username=current_user.username,
        text=text
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return {
        "message": "Comment created successfully",
        "comment": {
            "comment_id": str(comment.comment_id),
            "post_id": str(comment.post_id),
            "user_id": str(comment.user_id),
            "username": comment.username,
            "text": comment.text,
            "created_at": comment.created_at.isoformat() if comment.created_at else None,
        }
    }
@auth_router.get("/posts/{post_id}/comments")
def get_comments(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    post = db.query(PostModel).filter(PostModel.post_id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comments = db.query(CommentModel).filter(CommentModel.post_id == post_id).order_by(CommentModel.created_at.desc()).all()
    return [
        {
            "comment_id": str(comment.comment_id),
            "post_id": str(comment.post_id),
            "user_id": str(comment.user_id),
            "username": comment.username,
            "text": comment.text,
            "created_at": comment.created_at.isoformat() if comment.created_at else None,
        }
        for comment in comments
    ]

# Creating and Getting Likes
@auth_router.post("/posts/{post_id}/like")
def like_post(post_id: str, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    existing_like = db.query(LikeModel).filter_by(post_id=post_id, user_id=current_user.user_id).first()
    if existing_like:
        db.delete(existing_like)
        db.commit()
        return {"message": "Post unliked"}
    like = LikeModel(post_id=post_id, user_id=current_user.user_id)
    db.add(like)
    db.commit()
    return {"message": "Post liked"}

@auth_router.get("/posts/{post_id}/likes")
def get_likes(post_id: str, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    count = db.query(LikeModel).filter_by(post_id=post_id).count()
    return {"likes_count": count}

app.include_router(auth_router)
