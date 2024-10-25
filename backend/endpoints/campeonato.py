from fastapi import APIRouter
from db.db import Session
from typing import List
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from datetime import datetime
from pydantic import BaseModel
from classes.campeonato import Campeonato
from classes.exercicio_campeonato import ExercicioCampeonato
from classes.grupo_muscular import GrupoMuscular
from classes.exercicio import Exercicio
from classes.treino import Treino
from classes.user_exercicio import UserExercicio
from classes.user import User

router = APIRouter(
    tags=["campeonato"],
    prefix='/campeonato',
    responses={404: {"description": "Not found"}}
)

class ExercicioModel(BaseModel):
    exercicio_id: int
    qtd_serie: int
    qtd_repeticoes: int

class CampeonatoModel(BaseModel):
    nome: str
    duracao: datetime
    participantes_ids: list[int]
    exercicios: list[ExercicioModel]
    # criador: int

@router.post("/")
def add_campeonato(model: CampeonatoModel):
    with Session() as sess:
        participantes = sess.scalars(select(User).where(User.id.in_(model.participantes_ids))).all()
        exercicios = [ExercicioCampeonato(exercicio_id=e.exercicio_id, qtd_serie=e.qtd_serie, qtd_repeticoes=e.qtd_repeticoes) for e in model.exercicios]

        camp = Campeonato(nome=model.nome, duracao=model.duracao)
        camp.users.extend(participantes)
        camp.exercicios.extend(exercicios)
        sess.add(camp)
        sess.commit()
        return camp.id

@router.get("/{user_id}")
def get_campeonato(user_id: int):
    with Session() as sess:
        campeonatos = sess.execute(
            select(
                Campeonato.id, 
                Campeonato.nome, 
                Campeonato.duracao, 
                func.string_agg(User.nickname, ', ').label("participantes"),
            )
            .join(Campeonato.users)
            .filter(User.id != user_id)
            .group_by(Campeonato.id, Campeonato.nome, Campeonato.duracao)
            ).mappings().all()
        return campeonatos

@router.get("/detalhes/{campeonato_id}")
def get_campeonato_detalhes(campeonato_id: int):
    stmt = select(
            Campeonato.id,
            Campeonato.nome,
            Campeonato.duracao, 
            ExercicioCampeonato.id, 
            ExercicioCampeonato.qtd_serie, 
            ExercicioCampeonato.qtd_repeticoes, 
            Exercicio.nome.label('exercicio_nome'), 
            GrupoMuscular.id.label('grupo_muscular_id'), 
            GrupoMuscular.nome.label('grupo_muscular_nome')
        )\
        .join(ExercicioCampeonato, Campeonato.id == ExercicioCampeonato.campeonato_id)\
        .join(Exercicio, ExercicioCampeonato.exercicio_id == Exercicio.id)\
        .join(GrupoMuscular, Exercicio.grupo_muscular_id == GrupoMuscular.id)\
        .filter(Campeonato.id == campeonato_id)

    with Session() as sess:
        result = sess.execute(stmt).all()

    campeonato = None
    for row in result:
        if(campeonato is None):
            campeonato = {
                "id": row[0],
                "nome": row[1],
                "duracao": row[2],
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

        campeonato["exercicios"].append(exercicio_info)

    return campeonato

    
class TreinoModel(BaseModel):
    campeonatoId: int
    userId: int
    exercicios_ids: List[int]

@router.post("/add-treino")
def add_treino(model: TreinoModel):
    with Session() as sess:
        campeonato_id = sess.execute(select(ExercicioCampeonato.campeonato_id).where(ExercicioCampeonato.id == model.exercicios_ids[0])).first()[0]
        treino = Treino(user_id=model.userId, campeonato_id=campeonato_id)
        exercicios = [UserExercicio(exec_campeonato_id=id) for id in model.exercicios_ids]
        treino.exercicios = exercicios
        sess.add(treino)
        sess.commit()
    return "O novo treino foi adicionado com sucesso."

@router.delete("/{campeonato_id}")
def delete_campeonato(campeonato_id: int):
    with Session() as sess:
        campeonato = sess.scalar(select(Campeonato)
                                 .options(selectinload(Campeonato.exercicios))
                                #  .options(selectinload(Campeonato.exercicios))
                                 .where(Campeonato.id == campeonato_id)
                                )
        sess.delete(campeonato)
        sess.commit()
    return "O campeonato foi deletado com sucesso"
