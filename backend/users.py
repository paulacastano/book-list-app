from typing import Annotated
import os
import jwt
from passlib.hash import bcrypt
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Field, Session, SQLModel, create_engine, select
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

SECRET_KEY = "clave_super_secreta"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    password: str = Field()

database_users_url = os.getenv("USERS_DB_URL")
users_engine = create_engine(database_users_url)

def create_users_db_and_tables():
    SQLModel.metadata.create_all(users_engine, tables=[SQLModel.metadata.tables["user"]])


def get_users_session():
    with Session(users_engine) as session:
        yield session

UsersSessionDep = Annotated[Session, Depends(get_users_session)]


def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_password(plain_password, hashed_password):
    return bcrypt.verify(plain_password, hashed_password)

def get_password_hash(password):
    return bcrypt.hash(password)


router = APIRouter()

@router.post("/register")
def register(user: User, session: UsersSessionDep):
    statement = select(User).where(User.username == user.username)
    user_in_db = session.exec(statement).first()
    if user_in_db is not None:
        raise HTTPException(status_code=400, detail="El usuario ya existe.")
    hashed_password = get_password_hash(user.password)
    session.add(User(username=user.username, password=hashed_password))
    session.commit()
    return {"message": "Usuario registrado con éxito"}

@router.post("/token")
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: UsersSessionDep):
    statement = select(User).where(User.username == form_data.username)
    user = session.exec(statement).first()
    print(user)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}