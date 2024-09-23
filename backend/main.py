from fastapi import FastAPI
from db.db import engine, Base
from datetime import date 

# nao apagar
from classes import campeonato, dificuldade, exercicio, item, rotina, skill, user_skill, exercicio_rotina
from classes.classe import Classe, insert_classes
from classes.user import User

app = FastAPI()
Base.metadata.create_all(engine)

insert_classes()

@app.get("/cadastro")
def read_root():
    user = User(
        nickname="test",
        fullname="teste",
        email="test@test",
        level=0, 
        admin=False,
        nascimento=date.today(),
        classe_id=1
    )
    user.add(user)
    return {"id": user.id}
