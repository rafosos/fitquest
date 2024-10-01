from fastapi import FastAPI, Body, Response, status
from typing import Annotated
from db.db import engine, Base, Session
from sqlalchemy import select, or_
from datetime import date 
import uvicorn

# nao apagar
from classes import campeonato, dificuldade, exercicio, item, rotina, user_skill, exercicio_rotina
from classes.classe import Classe, insert_classes
from classes.amizade import Amizade
from classes.user import User
from classes.skill import Skill, insert_skills
from classes.status import Status, insert_statuses

app = FastAPI()
Base.metadata.create_all(engine)

insert_classes()
insert_skills()
insert_statuses()

@app.get("/hello-world")
def hello_world():
    return "hello world"
    
@app.post("/cadastro")
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

@app.post("/login")
def login(login: Annotated[str, Body()], senha: Annotated[str, Body()], res: Response):
    print("POST: login", flush=True)
    with Session() as sess:
        stmt = select(User).where(or_(User.nickname == login, User.email == login), User.senha == senha)
        user = sess.scalar(stmt)
        if(user):
            res.status_code = status.HTTP_200_OK
            return user.nickname
        else:
            res.status_code = status.HTTP_401_UNAUTHORIZED
            return "Erro no login"

@app.get("/classe")
def get_classes():
    with Session() as sess:
        result = Classe.select_all(Classe, sess)
        return [{"id": r[0].id, "nome": r[0].nome} for r in result.all()]

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)