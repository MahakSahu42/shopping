from fastapi import APIRouter
from pydantic import BaseModel

from app.core.security import create_access_token, hash_password


router = APIRouter()


class RegisterRequest(BaseModel):
    email: str
    password: str


@router.post("/register", status_code=201)
def register(payload: RegisterRequest) -> dict[str, str]:
    return {"email": payload.email, "password_hash": hash_password(payload.password)}


@router.post("/login")
def login(payload: RegisterRequest) -> dict[str, str]:
    return {"access_token": create_access_token(payload.email), "token_type": "bearer"}
