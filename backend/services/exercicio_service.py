from fastapi import HTTPException
from dtos.exercicio_model import ExercicioCampeonatoModel
from db.db import Session
from sqlalchemy import select, or_, and_, func, text, case, literal_column, Interval
from sqlalchemy.orm import selectinload
from sqlalchemy.sql.expression import bindparam
from models.user import User
from models.exercicio import Exercicio
from models.treino_exercicio import TreinoExercicio
from models.treino import Treino, StatusTreino
from models.exercicio_rotina import ExercicioRotina
from models.exercicio_campeonato import ExercicioCampeonato
from datetime import timedelta

def add_exec(model: ExercicioCampeonatoModel):
    with Session() as sess:
        exec = Exercicio(**model)
        sess.add(exec)
        sess.commit()
        return "O pedido de amizade foi enviado com sucesso"

def get_exercicios(current_user: User, f: str, ids_escolhidos: list[int]):
    with Session() as sess:
        stmt = select(Exercicio).options(selectinload(Exercicio.grupo_muscular))\
        .where(
            and_(
                Exercicio.nome.ilike(f"%%{f}%%"), 
                Exercicio.id.not_in(ids_escolhidos), 
                or_(
                    Exercicio.criado_por == None, 
                    Exercicio.criado_por == current_user.id
                )
            )
        )
        exercicios = sess.scalars(stmt).all()

        return exercicios

async def get_treinos_resumo(current_user: User, amigoId: int):
    if not amigoId:
        user_id = current_user.id
    else:
        user_id = amigoId
        
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
        .join(TreinoExercicio, TreinoExercicio.treino_id == Treino.id)\
        .join(ExercicioRotina, ExercicioRotina.id == TreinoExercicio.exec_rotina_id, isouter=True)\
        .join(ExercicioCampeonato, ExercicioCampeonato.id == TreinoExercicio.exec_campeonato_id, isouter=True)\
        .join(Exercicio, or_(ExercicioCampeonato.exercicio_id == Exercicio.id, ExercicioRotina.exercicio_id == Exercicio.id))\
        .where(and_(Treino.user_id == user_id, Treino.status == StatusTreino.ativo))\
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
                count(*) streak_length \
            from ( \
                select \
                    t.*, \
                    sum( \
                        case \
                            when lag_data is null or data = lag_data + INTERVAL '1 day' \
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

def get_streak_dia(current_user: User):
    user_id = current_user.id
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
            (literal_column("t.semana_passada").is_(None), 0),
            (literal_column("t.semana") != literal_column("t.semana_passada")
            and literal_column("t.semana") == func.date_part('week', literal_column("t.data_passada") + bindparam("semana_prox", timedelta(weeks=1), Interval()))
            , 0),
            else_=1
        ).label('grp')
    ).select_from(t) \
    .order_by(literal_column("t.semana").desc()).cte("cte1")

    stmt = select(
        func.min(literal_column("cte1.semana_passada")).label("streak_start"),
        func.max(literal_column("cte1.semana")).label("streak_end"),
        (func.count()).label("streak_length")
    ).select_from(cte1)\
    .where(literal_column("cte1.grp") == 0)
    
    return stmt

def get_streak_semana(current_user: User):
    user_id = current_user.id
    with Session() as sess:
        streak = sess.execute(query_streak_semana(user_id)).mappings().first()
    return streak

    # contagem de dias na ultima semana
    # select count(distinct data)
    # from public.user_exercicio as t
    # where date_part('week', data) = date_part('week', current_date)

def get_streaks_geral(user_id: int):
    with Session() as sess:
        dia = sess.execute(query_streak_dia(user_id)).mappings().first()
        semana = sess.execute(query_streak_semana(user_id)).mappings().first()
        return {"streak_diario": dia, "streak_semanal": semana}
    
def atualizar_status_treino(treino_id: int, status: StatusTreino):
    with Session() as sess:
        treino = sess.scalar(select(Treino).where(Treino.id == treino_id))
        if not treino:
            raise HTTPException(status_code=400, detail=f"Treino com id {treino_id} não encontrado.")
        
        treino.status = status
        
        try:
            sess.commit()
        except Exception as e:
            raise HTTPException(status_code=500, detail=e.args)
        
        return "Status do treino atualizado com sucesso.."
    
def get_treinos_deletados(current_user: User):
    user_id = current_user.id
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
        .join(TreinoExercicio, TreinoExercicio.treino_id == Treino.id)\
        .join(ExercicioRotina, ExercicioRotina.id == TreinoExercicio.exec_rotina_id, isouter=True)\
        .join(ExercicioCampeonato, ExercicioCampeonato.id == TreinoExercicio.exec_campeonato_id, isouter=True)\
        .join(Exercicio, or_(ExercicioCampeonato.exercicio_id == Exercicio.id, ExercicioRotina.exercicio_id == Exercicio.id))\
        .where(and_(Treino.user_id == user_id, Treino.status == StatusTreino.deletado))\
        .group_by(Treino.id,
            Treino.rotina_id,
            Treino.campeonato_id,
            Treino.nome,
            Treino.tipo,
            Treino.data,)\
        .order_by(Treino.data.desc())
        
        result = sess.execute(stmt).mappings().all()
        
        return result