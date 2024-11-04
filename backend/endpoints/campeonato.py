from fastapi import APIRouter
from db.db import Session
from typing import List
from sqlalchemy import select, func, case, and_, literal_column, text, or_
from sqlalchemy.orm import selectinload, aliased
from datetime import datetime
from pydantic import BaseModel
from classes.campeonato import Campeonato
from classes.exercicio_campeonato import ExercicioCampeonato
from classes.grupo_muscular import GrupoMuscular
from classes.exercicio import Exercicio
from classes.treino import Treino, TipoTreino
from classes.user_exercicio import UserExercicio
from classes.user_campeonato import user_campeonato
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

        camp = Campeonato(nome=model.nome, duracao=model.duracao, criado_por_id=model.participantes_ids[-1])
        camp.users.extend(participantes)
        camp.exercicios.extend(exercicios)
        sess.add(camp)
        sess.commit()
        return camp.id

@router.get("/{user_id}")
def get_campeonato(user_id: int):
    with Session() as sess:
        participantes = aliased(User)
        criador = aliased(User)
        campeonatos = sess.execute(
            select(
                Campeonato.id, 
                Campeonato.nome, 
                Campeonato.duracao,
                Campeonato.data_criacao,
                criador.nickname.label("nickname_criador"),
                func.string_agg(case((participantes.id != user_id, participantes.nickname), else_=None), ', ').label("participantes"),
            )
            .join(criador, Campeonato.criador)
            .join(participantes, Campeonato.users)
            .group_by(Campeonato.id, Campeonato.nome, Campeonato.duracao, criador.nickname)
            .where(or_(criador.id == user_id, participantes.id == user_id)) #check this with a 3rd user
            ).mappings().all()
        return campeonatos

@router.get("/detalhes/{user_id}/{campeonato_id}")
def get_campeonato_detalhes(user_id: int, campeonato_id: int):
    cte_ultimo_treino = select(Treino.data.label("ultimo_treino"), Treino.campeonato_id)\
        .where(
            and_(
                Treino.tipo == TipoTreino.campeonato, 
                Treino.user_id == user_id,
                Treino.campeonato_id == campeonato_id
            ))\
        .limit(1).order_by(Treino.data.desc()).cte("cte_ultimo_treino")
    
    stmt = select(
            Campeonato.id,
            Campeonato.nome,
            Campeonato.duracao, 
            literal_column("cte_ultimo_treino.ultimo_treino"),
            ExercicioCampeonato.id, 
            ExercicioCampeonato.qtd_serie, 
            ExercicioCampeonato.qtd_repeticoes, 
            Exercicio.nome.label('exercicio_nome'), 
            GrupoMuscular.id.label('grupo_muscular_id'), 
            GrupoMuscular.nome.label('grupo_muscular_nome'),
        )\
        .select_from(Campeonato)\
        .join(cte_ultimo_treino, literal_column("cte_ultimo_treino.campeonato_id") == Campeonato.id, isouter=True)\
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
                "ultimo_treino": row[3],
                "exercicios": []
            }

        exercicio_info = {
            "id": row[4],
            "qtd_serie": row[5],
            "qtd_repeticoes": row[6],
            "nome": row[7],
            "grupo_muscular_id": row[8],
            "grupo_muscular_nome": row[9],
        }

        campeonato["exercicios"].append(exercicio_info)

    return campeonato

@router.get("/detalhes_progresso/{campeonato_id}")
def get_progresso(campeonato_id: int):
    with Session() as sess:
        stmt = select(
            user_campeonato.c.user_id,
            User.nickname,
            User.fullname,
            func.count(user_campeonato.c.user_id).label("dias")
        ).select_from(user_campeonato)\
        .join(User, User.id == user_campeonato.c.user_id)\
        .join(Treino, User.id == Treino.user_id, isouter=True)\
        .where(and_(Treino.tipo == TipoTreino.campeonato, user_campeonato.c.campeonato_id == campeonato_id))\
        .group_by(user_campeonato.c.user_id, User.nickname, User.fullname)\
        .order_by(func.count(user_campeonato.c.user_id).desc())
    
        return sess.execute(stmt).mappings().all()
    
class TreinoModel(BaseModel):
    campeonatoId: int
    userId: int
    exercicios_ids: List[int]

@router.post("/add-treino")
def add_treino(model: TreinoModel):
    with Session() as sess:
        result = sess.execute(
            select(
                ExercicioCampeonato.campeonato_id,
                Campeonato.nome
            )  
            .select_from(ExercicioCampeonato)
            .join(Campeonato, ExercicioCampeonato.campeonato_id == Campeonato.id)
            .where(ExercicioCampeonato.id == model.exercicios_ids[0])).first()
        treino = Treino(user_id=model.userId, campeonato_id=result[0], nome=result[1], tipo=TipoTreino.campeonato)
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
                                 .where(Campeonato.id == campeonato_id)
                                )
        sess.delete(campeonato)
        sess.commit()
    return "O campeonato foi deletado com sucesso"
