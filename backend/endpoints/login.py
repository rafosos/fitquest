from fastapi import APIRouter, Body, Response, status
from typing import Annotated
from sqlalchemy import select, or_
from db.db import Session
from classes.user import User

router = APIRouter(
    tags=["classe"],
    responses={404: {"description": "Not found"}}
)

@router.post("/cadastro")
def cadastro(
    nickname: Annotated[str, Body()], 
    fullname: Annotated[str, Body()], 
    email: Annotated[str, Body()], 
    nascimento: Annotated[str, Body()], 
    classe: Annotated[int, Body()], 
    senha: Annotated[str, Body()], 
    ):
    user = User(
        nickname=nickname,
        fullname=fullname,
        email=email,
        level=0,
        admin=False,
        nascimento=nascimento,
        classe_id=classe,
        senha=senha
    )
    user.add_user()
    return {"id": user.id}

@router.post("/login")
def login(login: Annotated[str, Body()], senha: Annotated[str, Body()], res: Response):
    print("POST: login", flush=True)
    with Session() as sess:
        stmt = select(User).where(or_(User.nickname == login, User.email == login), User.senha == senha)
        user = sess.scalar(stmt)
        if(user):
            res.status_code = status.HTTP_200_OK
            return user.id
        else:
            res.status_code = status.HTTP_401_UNAUTHORIZED
            return "Erro no login"