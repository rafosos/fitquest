import uvicorn
from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from db.db import engine, Base
from endpoints import user, classe, login, exercicio, campeonato, rotina

# nao apagar
from classes.amizade import Amizade
from classes.classe import Classe, insert_classes
from classes.skill import Skill, insert_skills
from classes.status import Status, insert_statuses
from classes.user import User
from classes.exercicio import Exercicio, insert_exercicios
from classes.campeonato import Campeonato
from classes.exercicio import Exercicio
from classes.rotina import Rotina
from classes.grupo_muscular import GrupoMuscular, insert_grupos_musculares
from classes import \
    treino, \
    exercicio_campeonato, \
    exercicio_rotina, \
    item, \
    user_skill, \
    user_exercicio

app = FastAPI()
# app = FastAPI(dependencies=Depends[login.get_current_active_user])
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

Base.metadata.create_all(engine)
# insert_classes()
# insert_skills()
insert_statuses()
insert_grupos_musculares()
insert_exercicios()

app.include_router(user.router)
app.include_router(classe.router)
app.include_router(login.router)
app.include_router(exercicio.router)
app.include_router(campeonato.router)
app.include_router(rotina.router)

@app.get("/hello-world")
def hello_world():
    return "hello world"

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)