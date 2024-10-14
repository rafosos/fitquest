from fastapi import APIRouter, Response, status, HTTPException
from typing import List
from collections import defaultdict
from db.db import Session
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from classes.exercicio import Exercicio
from classes.rotina import Rotina
from classes.grupo_muscular import GrupoMuscular
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
            sess.add(rotina)

            exec_list = []
            
            for exec in model.exercicios:
                exec_entidade = sess.scalar(select(Exercicio).where(Exercicio.id == exec.id))
                if exec_entidade is None:
                    raise HTTPException(status_code=400, detail=f"Exercicio com id {exec.id} nao encontrado")
                
                exec_entidade.rotinas.append(
                    ExercicioRotina(
                        exercicio_id=exec_entidade.id, 
                        exercicio=exec_entidade, 
                        rotina=rotina, 
                        qtd_serie=exec.series, 
                        qtd_repeticoes=exec.repeticoes
                    )
                ) 

            sess.commit()
    res.status_code = status.HTTP_200_OK
    return "A nova rotina foi adicionada com sucesso."

@router.get("/rotina/{user_id}")
def add_amigo(user_id: int):
        stmt = (
            select(
                Rotina.id, 
                Rotina.nome, 
                Rotina.dias, 
                Exercicio.id, 
                ExercicioRotina.qtd_serie, 
                ExercicioRotina.qtd_repeticoes, 
                Exercicio.nome.label('exercicio_nome'), 
                GrupoMuscular.id.label('grupo_muscular_id'), 
                GrupoMuscular.nome.label('grupo_muscular_nome')
            )
            .join(ExercicioRotina, Rotina.id == ExercicioRotina.rotina_id)
            .join(Exercicio, ExercicioRotina.exercicio_id == Exercicio.id)
            .join(GrupoMuscular, Exercicio.grupo_muscular_id == GrupoMuscular.id)
            .filter(Rotina.user_id == user_id)
            .order_by(Rotina.id)
        )
        with Session() as sess:
            result = sess.execute(stmt).all()

        rotinas_dict = defaultdict(list)
        for row in result:
            rotina_id = row[0]

            if(not rotinas_dict[rotina_id]):
                rotinas_dict[rotina_id] = {
                    "id": row[0],
                    "nome": row[1],
                    "dias": row[2],
                    "exercicios": []
                }

            exercicio_info = {
                "id": row[3],
                "qtd_serie": row[4],
                "qtd_repeticoes": row[5],
                "nome": row[6],
                "grupo_muscular_id": row[7],
                "grupo_muscular_nome": row[8],
            }

            rotinas_dict[rotina_id]["exercicios"].append(exercicio_info)


        return [v for k,v in rotinas_dict.items()]