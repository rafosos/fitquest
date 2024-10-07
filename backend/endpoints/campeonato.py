from fastapi import APIRouter
from db.db import Session
from sqlalchemy import select
from datetime import datetime
from pydantic import BaseModel
from classes.campeonato import Campeonato
from classes.user import User

router = APIRouter(
    tags=["campeonato"],
    responses={404: {"description": "Not found"}}
)

class CampeonatoModel(BaseModel):
    nome: str
    duracao: datetime
    participantes_ids: list[int]
    # criador: int


@router.post("/add-campeonato")
def add_amigo(model: CampeonatoModel):
    with Session() as sess:
        participantes = sess.scalars(select(User).where(User.id.in_(model.participantes_ids))).all()
        camp = Campeonato(nome=model.nome, duracao=model.duracao)
        camp.users.extend(participantes)
        sess.add(camp)
        sess.commit()
        return camp.id

@router.get("/get-campeonatos/{user_id}")
def add_amigo(user_id: int):
    with Session() as sess:
        campeonatos = sess.scalars(select(Campeonato).join(Campeonato.users).filter_by(id=user_id)).all()
        return campeonatos