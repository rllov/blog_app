from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware  # Add this import



app = FastAPI()

origins = [
    "https://blog-app-fe-be.onrender.com",
    "http://localhost:5173",  # Vite default
    "http://127.0.0.1:5173",
    "http://localhost:3000"   # Create-React-App default
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    username: str
    email: str
    password: str


@app.get("/")
def read_root():
    return {"message": "Hello shmoe mama 123"}

@app.post("/signup")
def signup(user:UserCreate):
    if user.username == "existing_user":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    return {"message": "User created successfully", "user": user}