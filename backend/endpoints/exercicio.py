from fastapi import APIRouter, Query, Response, status
from typing import Annotated
from db.db import Session
from sqlalchemy import select, or_, and_
from sqlalchemy.orm import selectinload
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
def add_exec(model: ExercicioModel, res: Response):
    with Session() as sess:
        exec = Exercicio(**model)
        sess.add(exec)
        sess.commit()
        res.status_code = status.HTTP_200_OK
        return "O pedido de amizade foi enviado com sucesso"
    
@router.get("/exercicio/{user_id}")
def get_exercicios(user_id: int, f: str, ids_escolhidos: Annotated[list[int] | None, Query()] = []):
    with Session() as sess:
        stmt = select(Exercicio).options(selectinload(Exercicio.grupo_muscular))\
        .where(
            and_(
                Exercicio.nome.ilike(f"%%{f}%%"), 
                Exercicio.id.not_in(ids_escolhidos), 
                or_(
                    Exercicio.criado_por == None, 
                    Exercicio.criado_por == user_id
                )
            )
        )
        exercicios = sess.scalars(stmt).all()

        return exercicios