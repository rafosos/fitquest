from fastapi import APIRouter, Query, Response, status
from typing import Annotated
from db.db import Session
from sqlalchemy import select, or_, and_, func, text, case, literal_column, Interval
from sqlalchemy.sql.expression import bindparam
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from classes.exercicio import Exercicio
from classes.user_exercicio import UserExercicio
from classes.exercicio_rotina import ExercicioRotina
from classes.exercicio_campeonato import ExercicioCampeonato
from datetime import timedelta
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
            Treino.campeonato_id,
            Treino.data,
            Treino.nome,
            Treino.tipo,
            func.string_agg(Exercicio.nome, ", ").label("exercicios"),
        ).select_from(Treino)\
        .join(UserExercicio, UserExercicio.treino_id == Treino.id)\
        .join(ExercicioRotina, ExercicioRotina.id == UserExercicio.exec_rotina_id, isouter=True)\
        .join(ExercicioCampeonato, ExercicioCampeonato.id == UserExercicio.exec_campeonato_id, isouter=True)\
        .join(Exercicio, or_(ExercicioCampeonato.exercicio_id == Exercicio.id, ExercicioRotina.exercicio_id == Exercicio.id))\
        .where(Treino.user_id == user_id)\
        .group_by(Treino.id,
            Treino.rotina_id,
            Treino.campeonato_id,
            Treino.nome,
            Treino.tipo,
            Treino.data,)\
        .order_by(Treino.data.desc())
        
        result = sess.execute(stmt).mappings().all()

        return result
    
def query_streak_dia(user_id):
    return text(
          f"select \
                min(lag_data) streak_start, \
                max(data) streak_end, \
                count(*) + 1 streak_length \
            from ( \
                select \
                    t.*, \
                    sum( \
                        case \
                            when data = lag_data + INTERVAL '1 day' \
                            then 0 \
                            else 1 \
                        end \
                    ) over(order by data desc) grp \
                from ( \
                    select  \
                        data,  \
                        lag(data) over(order by data) lag_data \
                    from treino \
                    where user_id = {user_id} \
                    group by data \
                ) t \
            order by data desc \
            ) t \
            where grp = 0; \
        ")

@router.get("/exercicio/streak_dia/{user_id}")
def get_streak_dia(user_id:int):
    with Session() as sess:
        streak = sess.execute(query_streak_dia(user_id)).mappings().first()
    return streak

def query_streak_semana(user_id):
    t = select(
            func.date_part('WEEK', Treino.data).label('semana'),
            func.date_part('WEEK', func.lag(Treino.data).over()).label('semana_passada'),
            func.lag(Treino.data).over().label("data_passada")
        ).where(Treino.user_id == user_id)\
        .group_by(Treino.data).cte("t")
    
    cte1 = select(
        t,
        case(
            (literal_column("t.semana") == literal_column("t.semana_passada"), 2),
            (literal_column("t.semana") != literal_column("t.semana_passada") 
                and literal_column("t.semana") == func.date_part('week', literal_column("t.data_passada") + bindparam("semana_prox", timedelta(weeks=1), Interval())), 0),
            else_=1
        ).label('grp')
    ).select_from(t) \
    .order_by(literal_column("t.semana").desc()).cte("cte1")

    stmt = select(
        func.min(literal_column("cte1.semana_passada")).label("streak_start"),
        func.max(literal_column("cte1.semana")).label("streak_end"),
        (func.count() + 1).label("streak_length")
    ).select_from(cte1)\
    .where(literal_column("cte1.grp") == 0)
    
    return stmt

@router.get("/exercicio/streak_semana/{user_id}")
def get_streak_semana(user_id:int):
    with Session() as sess:
        streak = sess.execute(query_streak_semana(user_id)).mappings().first()
        
        # streak = sess.execute(text(
        #   f"select  \
        #         min(semana_passada) streak_start,  \
        #         max(semana) streak_end, \
        #         count(*) + 1 streak_length \
        #     from ( \
        #         select  \
        #             t.*, \
        #             case \
        #                 when semana = semana_passada \
        #                 then 2 \
        #                 when semana != semana_passada and semana = DATE_PART('week', data_passada + interval '1 week') \
        #                 then 0 \
        #                 else 1  \
        #             end grp \
        #         from ( \
        #             select \
        #                 DATE_PART('week', data) as semana, \
        #                 DATE_PART('week', lag(data) over(order by data)) as semana_passada, \
        #                 lag(data) over(order by data) as data_passada \
        #             from treino \
        #             where user_id = {user_id} \
        #             group by data \
        #         ) t \
        #         order by semana desc \
        #     ) t \
        #     where grp = 0; \
        # ")).mappings().first()
    return streak

    # contagem de dias na ultima semana
    # select count(distinct data)
    # from public.user_exercicio as t
    # where date_part('week', data) = date_part('week', current_date)

@router.get("/exercicio/streak_geral/{user_id}")
def get_streaks_geral(user_id: int):
    with Session() as sess:
        dia = sess.execute(query_streak_dia(user_id)).mappings().first()
        semana = sess.execute(query_streak_semana(user_id)).mappings().first()
        return {"streak_diario": dia, "streak_semanal": semana}
        