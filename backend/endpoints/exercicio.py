from fastapi import APIRouter, Query, Response, status
from typing import Annotated
from db.db import Session
from sqlalchemy import select, or_, and_, func
from sqlalchemy.orm import selectinload
from collections import defaultdict
from pydantic import BaseModel
from classes.exercicio import Exercicio
from classes.user_exercicio import UserExercicio
from classes.rotina import Rotina
from classes.exercicio_rotina import ExercicioRotina
from classes.exercicio_campeonato import ExercicioCampeonato
from classes.campeonato import Campeonato
from classes.treino import Treino

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

@router.get("/treinos_resumo/{user_id}")
def get_treinos_resumo(user_id: int):
    with Session() as sess:
        stmt = select(
            Treino.id,
            Treino.rotina_id,
            Treino.data,
            func.string_agg(Exercicio.nome, ", ").label("exercicios"),
            Rotina.nome.label("rotina_nome"),
            Campeonato.nome.label("campeonato_nome")
        ).select_from(Treino)\
        .join(UserExercicio, UserExercicio.treino_id == Treino.id)\
        .join(ExercicioRotina, ExercicioRotina.id == UserExercicio.exec_rotina_id, isouter=True)\
        .join(Rotina, ExercicioRotina.rotina_id == Rotina.id, isouter=True)\
        .join(ExercicioCampeonato, ExercicioCampeonato.id == UserExercicio.exec_campeonato_id, isouter=True)\
        .join(Campeonato, Campeonato.id == ExercicioCampeonato.campeonato_id, isouter=True)\
        .join(Exercicio, or_(ExercicioCampeonato.exercicio_id == Exercicio.id, ExercicioRotina.exercicio_id == Exercicio.id))\
        .where(Treino.user_id == user_id)\
        .group_by(Treino.id,
            Treino.rotina_id,
            Treino.data,
            Rotina.nome.label("rotina_nome"),
            Campeonato.nome.label("campeonato_nome"))
        
        result = sess.execute(stmt).mappings().all()

        return result

@router.get("/exercicio/streak/{user_id}")
def get_streak(user_id:int):
    return user_id

    # query para exercicios em dias seguidos (contar quantos dias nessa semana)
    # select min(lag_data) streak_start, max(data) streak_end,
    #     count(*) + 1 streak_length
    # from (
    # select t.*,
    #         sum(
    #         case when data = lag_data + INTERVAL '1 day'
    #             -- case when datepart(weekday, lag_date) = 6 then 3 else 1 end,
    #         then 0 else 1 end) over(order by data desc)  grp
    # from (
    #     select data, lag(data) over(order by data) lag_data
    #     from user_exercicio
    #     group by data
    # ) t
    # order by data desc
    # ) t
    # where grp = 0
    # contagem de dias na ultima semana
    # select count(distinct data)
    # from public.user_exercicio as t
    # where date_part('week', data) = date_part('week', current_date) 