from fastapi import APIRouter, Response, status
from typing import List
from db.db import Session
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from classes.exercicio import Exercicio
from classes.rotina import Rotina
from classes.exercicio_rotina import ExercicioRotina

router = APIRouter(
    tags=["rotina"],
    responses={404: {"description": "Not found"}}
)

class ExercicioModel(BaseModel):
    id: int
    series: int
    repeticoes: int

class RotinaModel(BaseModel):
    nome: str
    dias: int
    exercicios: List[ExercicioModel]

@router.post("/add-rotina/{user_id}")
def add_rotina(user_id, model: RotinaModel, res: Response):
    with Session() as sess:
        rotina = Rotina(user_id=user_id, nome=model.nome, dias=model.dias)

        for exec in model.exercicios:
            exec_entidade = sess.scalar(select(Exercicio).where(Exercicio.id == exec.id))
            rotina.exercicios.append(ExercicioRotina(exercicio=exec_entidade, rotina=rotina, qtd_serie=exec.series, qtd_repeticoes=exec.repeticoes)) 

        sess.add(rotina)
        sess.commit()
        res.status_code = status.HTTP_200_OK
        return "A nova rotina foi adicionada com sucesso."

@router.get("/rotina/{user_id}")
def add_amigo(user_id: int):
    with Session() as sess:
        stmt = select(Rotina, Exercicio.nome, Exercicio.id)\
            .join(ExercicioRotina, ExercicioRotina.rotina_id == Rotina.id)\
            .join(Exercicio, Exercicio.id == ExercicioRotina.exercicio_id)\
            .where(Rotina.user_id==user_id)\
        .group_by(Rotina.id) # get this shit here to work!!!
            # .options(selectinload(Rotina.exercicios))\
        rotinas = [e[0] for e in sess.execute(stmt).all()]
        return rotinas