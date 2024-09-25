from fastapi import FastAPI, Body
from typing import Annotated
from db.db import engine, Base, Session
from sqlalchemy import select, or_
from datetime import date 
import uvicorn

# nao apagar
from classes import campeonato, dificuldade, exercicio, item, rotina, user_skill, exercicio_rotina
from classes.classe import Classe, insert_classes
from classes.user import User
from classes.skill import Skill, insert_skills

app = FastAPI()
Base.metadata.create_all(engine)

insert_classes()
insert_skills()

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
def login(login: Annotated[str, Body()], senha: Annotated[str, Body()]):
    print(login)
    print(senha)
    # with Session() as sess:
    return {}

@app.get("/classe")
def get_classes():
    return Classe.select_all()



if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)