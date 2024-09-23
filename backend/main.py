from fastapi import FastAPI
from db.db import engine, Base

# nao apagar
from classes import classe, user, campeonato, dificuldade, exercicio, item, rotina, skill

app = FastAPI()
Base.metadata.create_all(engine)


@app.get("/")
def read_root():
    return {"Hello": "World"}