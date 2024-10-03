from fastapi import APIRouter, Body, Response, status
from typing import Annotated
from db.db import Session
from sqlalchemy import select, or_, case, and_
from pydantic import BaseModel
from classes.exercicio import Exercicio

router = APIRouter(
    tags=["exercicio"],
    responses={404: {"description": "Not found"}}
)

class ExercicioModel(BaseModel):
    nome: str
    dificuldade_id: int

@router.post("/add-exec")
def add_amigo(model: ExercicioModel, res: Response):
    with Session() as sess:
        exec = Exercicio(**model)
        sess.add(exec)
        sess.commit()
        res.status_code = status.HTTP_200_OK
        return "O pedido de amizade foi enviado com sucesso"