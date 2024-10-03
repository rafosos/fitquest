import uvicorn
from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from db.db import engine, Base
from endpoints import user, classe, login

# nao apagar
from classes import campeonato, dificuldade, exercicio, item, rotina, user_skill, exercicio_rotina
from classes.classe import Classe, insert_classes
from classes.amizade import Amizade
from classes.user import User
from classes.skill import Skill, insert_skills
from classes.status import Status, insert_statuses

app = FastAPI()
# app = FastAPI(dependencies=Depends[login.get_current_active_user])
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

Base.metadata.create_all(engine)
insert_classes()
insert_skills()
insert_statuses()

app.include_router(user.router)
app.include_router(classe.router)
app.include_router(login.router)

@app.get("/hello-world")
def hello_world():
    return "hello world"

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)