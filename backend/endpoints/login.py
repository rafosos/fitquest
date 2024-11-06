from datetime import datetime, timedelta, timezone, date
import jwt
from fastapi import APIRouter, Body, Response, status, Depends, HTTPException
from typing import Annotated
from sqlalchemy import select, or_
from db.db import Session
from passlib.context import CryptContext
from classes.user import User
from pydantic import BaseModel
from jwt.exceptions import InvalidTokenError

SECRET_KEY = "95e03e0ea5649c41ba49b9a929994ef2154bec63faf096d02d51dd737d3c684b"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    tags=["conta"],
    responses={
        401: {"description": "Not authorized"},
        404: {"description": "Not found"}}
)

# class Token(BaseModel):
#     access_token: str
#     token_type: str

# class TokenData(BaseModel):
#     nickname: str | None = None
#     fullname: str | None = None
#     id: str | None = None

# def create_access_token(data: dict, expires_delta: timedelta | None = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.now(timezone.utc) + expires_delta
#     else:
#         expire = datetime.now(timezone.utc) + timedelta(minutes=15)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )

#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         nickname: str = payload.get("nickname")
#         if nickname is None:
#             raise credentials_exception
        
#         token_data = TokenData(nickname=nickname)
#     except InvalidTokenError:
#         raise credentials_exception
    
#     with Session() as sess:
#         user = sess.scalar(select(User).where(User.nickname == token_data.nickname))

#     if user is None:
#         raise credentials_exception
#     return user

class CadastroModel(BaseModel):
    nickname: str 
    fullname: str
    email: str
    # peso: float
    # altura: float
    nascimento: datetime 
    # classe: int
    senha: str
    
@router.post("/cadastro")
def cadastro(form: CadastroModel):
    user = User(
        nickname=form.nickname,
        fullname=form.fullname,
        email=form.email,
        level=0,
        admin=False,
        nascimento=form.nascimento,
        # classe_id=form.classe,
        senha=get_password_hash(form.senha)
    )
    user.add_user()
    return {"id": user.id}

@router.post("/login")
def login(login: Annotated[str, Body()], senha: Annotated[str, Body()], res: Response):
    print("POST: login", flush=True)
    with Session() as sess:
        stmt = select(User).where(or_(User.nickname == login, User.email == login))
        user = sess.scalar(stmt)
        if (not user):
            res.status_code = status.HTTP_401_UNAUTHORIZED
            return "Usuário não encontrado"
        
        if(verify_password(senha, user.senha)):
            res.status_code = status.HTTP_200_OK
            return user
        else:
            res.status_code = status.HTTP_401_UNAUTHORIZED
            return "Senha incorreta"