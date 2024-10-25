import uvicorn
from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from endpoints import user, classe, login, exercicio, campeonato, rotina
from classes.status import insert_statuses
from classes.exercicio import insert_exercicios
from classes.grupo_muscular import insert_grupos_musculares

import logging
from contextlib import asynccontextmanager
from alembic import command
from alembic.config import Config

log = logging.getLogger("uvicorn")

def run_migrations():
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")

@asynccontextmanager
async def lifespan(app_: FastAPI):
    log.info("Starting up...")
    log.info("run alembic upgrade head...")
    run_migrations()
    insert_statuses()
    insert_grupos_musculares()
    insert_exercicios()
    yield
    log.info("Shutting down...")


app = FastAPI(lifespan=lifespan)
# app = FastAPI(dependencies=Depends[login.get_current_active_user])
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app.include_router(user.router)
app.include_router(classe.router)
app.include_router(login.router)
app.include_router(exercicio.router)
app.include_router(campeonato.router)
app.include_router(rotina.router)

@app.get("/hello-world")
def hello_world():
    return "hello world"

# if __name__ == "__main__":
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)