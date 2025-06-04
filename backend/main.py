from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware  # Add this import



app = FastAPI()

origins = [
    "http://localhost:5173",  # Vite default
    "http://127.0.0.1:5173",
    "http://localhost:3000"   # Create-React-App default
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # More secure than "*"
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
    return {"message": "Hello shmoe mama 12"}