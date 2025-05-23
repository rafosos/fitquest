from datetime import datetime, timedelta, timezone
import jwt
from fastapi import APIRouter, Response, status, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from sqlalchemy import select, or_
from db.db import Session
from passlib.context import CryptContext
from models.user import User
from pydantic import BaseModel
from jwt.exceptions import InvalidTokenError
import os
import logging
from fastapi_csrf_protect import CsrfProtect
from fastapi_csrf_protect.exceptions import CsrfProtectError

SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = "HS256"
MINUTES_PER_MONTH = 43200
ACCESS_TOKEN_EXPIRE_MINUTES = MINUTES_PER_MONTH
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

logger = logging.getLogger("api")

class CsrfSettings(BaseModel):
  secret_key:str = 'Kaakaww!'

@CsrfProtect.load_config
def get_csrf_config():
  return CsrfSettings()

def verify_scrf(request: Request, csrf_protect: CsrfProtect = Depends()):
    csrf_protect.validate_csrf_in_cookies(request)

router = APIRouter(
    tags=["conta"],
    responses={
        401: {"description": "Not authorized"},
        404: {"description": "Not found"}}
)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str
    id: str
    
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    with Session() as sess:
        user = sess.scalar(select(User).where(User.username == "string"))

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        id: str = payload.get("id")
        if username is None or id is None:
            raise credentials_exception
        
        token_data = TokenData(username=username, id=str(id))
    except InvalidTokenError:
        raise credentials_exception
    
    with Session() as sess:
        user = sess.scalar(select(User).where(User.username == token_data.username))

    if user is None:
        raise credentials_exception
    return user

class CadastroModel(BaseModel):
    username: str 
    fullname: str
    email: str
    nascimento: datetime 
    senha: str
    
@router.post("/cadastro")
def cadastro(form: CadastroModel, request: Request):
    print(request.headers, flush=True)
    with Session() as sess:
        email_ja_existe = sess.execute(select(User).where(User.email == form.email)).first()
        if (email_ja_existe is not None):
            raise HTTPException(status_code=400, detail="Email já está em uso")
        
        username_ja_existe = sess.execute(select(User).where(User.username == form.username)).first()
        if (username_ja_existe is not None):
            raise HTTPException(status_code=400, detail="Username já está em uso")

    user = User(
        username=form.username,
        fullname=form.fullname,
        email=form.email,
        level=0,
        admin=False,
        nascimento=form.nascimento,
        senha=get_password_hash(form.senha)
    )
    user.add_self()
    return {"id": user.id}

@router.post("/login")
def login(form: Annotated[OAuth2PasswordRequestForm, Depends()], res: Response):
    print("POST: login", flush=True)
    with Session() as sess:
        stmt = select(User).where(or_(User.username == form.username, User.email == form.username))
        user = sess.scalar(stmt)
        if (not user):
           raise HTTPException(status_code=400, detail="Usuário não encontrado")
        
        if(verify_password(form.password, user.senha)):
            res.status_code = status.HTTP_200_OK
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": user.username, "id": user.id}, 
                expires_delta=access_token_expires
            )
            response = JSONResponse(status_code=200, content={"access_token": access_token, "token_type": "bearer", "username": user.username, "id": user.id})
            # csrf_protect.set_csrf_cookie(signed_token, response)
            return response
        else:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Senha incorreta")
        
@router.get("/csrftoken")
async def get_csrf_token(csrf_protect: CsrfProtect = Depends()):
    response = JSONResponse(status_code=200, content={'csrf_token':'cookie'})
    token = csrf_protect.generate_csrf_tokens(secret_key=os.environ["SECRET_KEY_CSRF"])
    csrf_protect.set_csrf_cookie(token, response)
    print("so testando")
    return response
