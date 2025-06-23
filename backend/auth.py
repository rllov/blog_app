import os
# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()  

from fastapi import HTTPException, status
from datetime import datetime, timezone, timedelta
from jose import jwt, JWTError


def create_access_token(data: dict, expires_delta: int = 3600):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + timedelta(seconds=expires_delta)
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.environ.get("JWT_SECRET_KEY") , algorithm=os.environ.get("JWT_ALGORITHM"))  # Use a secure secret key
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, os.environ.get("JWT_SECRET_KEY"), algorithms=[os.environ.get("JWT_ALGORITHM")])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
