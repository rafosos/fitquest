from fastapi import APIRouter, HTTPException
from db.db import Session
from typing import List, Annotated
from sqlalchemy import select, func, case, and_, literal_column, or_, literal
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
from classes.status import Status, statuses
from classes.amizade import Amizade
from fastapi import Depends
from .login import get_current_user

router = APIRouter(
    dependencies=[Depends(get_current_user)],
    tags=["campeonato"],
    prefix='/campeonato',
    responses={404: {"description": "Not found"}}
)

class ExercicioModel(BaseModel):
    exercicio_id: int
    qtd_serie: int
    qtd_repeticoes: int
    qtd_pontos: int

class CampeonatoModel(BaseModel):
    nome: str
    duracao: datetime
    participantes_ids: list[int]
    exercicios: list[ExercicioModel]
    # criador: int

@router.post("/")
def add_campeonato(model: CampeonatoModel, current_user: Annotated[User, Depends(get_current_user)]):
    model.participantes_ids.append(current_user.id)
    
    with Session() as sess:
        participantes = sess.scalars(select(User).where(User.id.in_(model.participantes_ids))).all()
        exercicios = [ExercicioCampeonato(exercicio_id=e.exercicio_id, qtd_serie=e.qtd_serie, qtd_repeticoes=e.qtd_repeticoes, pontos=e.qtd_pontos) for e in model.exercicios]

        camp = Campeonato(nome=model.nome, duracao=model.duracao, criado_por_id=model.participantes_ids[-1])
        camp.users.extend(participantes)
        camp.exercicios.extend(exercicios)
        sess.add(camp)
        sess.commit()
        return camp.id

@router.get("/")
def get_campeonato(current_user: Annotated[User, Depends(get_current_user)]):
    user_id = current_user.id
    with Session() as sess:
        participantes = aliased(User)
        criador = aliased(User)
        campeonatos = sess.execute(
            select(
                Campeonato.id, 
                Campeonato.nome, 
                Campeonato.duracao,
                Campeonato.data_criacao,
                criador.id.label("id_criador"),
                criador.username.label("username_criador"),
                func.string_agg(case((participantes.id != user_id, participantes.username), else_=None), ', ').label("participantes"),
            )
            .join(criador, Campeonato.criador)
            .join(participantes, Campeonato.users)
            .group_by(Campeonato.id, Campeonato.nome, Campeonato.duracao, criador.id, criador.username)
            .where(or_(criador.id == user_id, participantes.id == user_id)) #check this with a 3rd user
            ).mappings().all()
        return campeonatos
    
@router.get("/pesquisa/{termo}")
def get_campeonato(current_user: Annotated[User, Depends(get_current_user)], termo: str):
    user_id = current_user.id
    with Session() as sess:
        participantes = aliased(User)
        criador = aliased(User)

        cte = select(Status.id).where(Status.descricao == statuses[0]).cte("status_ativo") 

        ids_amigos = select(User.id).where(User.id.in_(
            select(case((Amizade.user1_id == user_id, Amizade.user2_id), else_=Amizade.user1_id))
                .join(cte, cte.c.id == Amizade.status_id)
                .where(or_(Amizade.user1_id == user_id, Amizade.user2_id == user_id))
            )
        ).cte("ids_amigos")

        campeonatos = sess.execute(
            select(
                Campeonato.id, 
                Campeonato.nome, 
                Campeonato.duracao,
                Campeonato.data_criacao,
                criador.id.label("id_criador"),
                criador.username.label("username_criador"),
                func.string_agg(participantes.username, ', ').label("participantes"),
            )
            .join(criador, Campeonato.criador)
            .join(participantes, Campeonato.users)
            .group_by(Campeonato.id, Campeonato.nome, Campeonato.duracao, criador.id, criador.username)
            .where(
                and_(
                    or_(
                        Campeonato.nome.ilike(f"%%{termo}%%"),
                        and_(
                            criador.id.in_(ids_amigos),
                            or_(criador.fullname.ilike(f"%%{termo}%%"),
                            criador.username.ilike(f"%%{termo}%%"))
                        )),
                    or_(criador.id != user_id, participantes.id != user_id)
                )
            )
            ).mappings().all()
        return campeonatos

@router.get("/detalhes/{campeonato_id}")
def get_campeonato_detalhes(current_user: Annotated[User, Depends(get_current_user)], campeonato_id: int):
    user_id = current_user.id
    cte_ultimo_treino = select(Treino.data.label("ultimo_treino"), Treino.campeonato_id)\
        .where(
            and_(
                Treino.tipo == TipoTreino.campeonato, 
                Treino.user_id == user_id,
                Treino.campeonato_id == campeonato_id
            ))\
        .limit(1).order_by(Treino.data.desc()).cte("cte_ultimo_treino")
    
    has_joined_subquery = (
        select(literal(True))
        .select_from(user_campeonato)
        .where(
            and_(
                user_campeonato.c.campeonato_id == Campeonato.id,
                user_campeonato.c.user_id == user_id
            )
        )
        .exists()
    )
    
    stmt = select(
            Campeonato.id,
            Campeonato.nome,
            Campeonato.duracao,
            Campeonato.criado_por_id,
            has_joined_subquery.label("has_joined"), 
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
                "criadorId": row[3],
                "joined": row[4],
                "ultimo_treino": row[5],
                "exercicios": []
            }

        exercicio_info = {
            "id": row[6],
            "qtd_serie": row[7],
            "qtd_repeticoes": row[8],
            "nome": row[9],
            "grupo_muscular_id": row[10],
            "grupo_muscular_nome": row[11],
        }

        campeonato["exercicios"].append(exercicio_info)

    return campeonato

@router.get("/detalhes_progresso/{campeonato_id}")
def get_progresso(campeonato_id: int):
    with Session() as sess:
        stmt = select(
            user_campeonato.c.user_id,
            User.username,
            User.fullname,
            func.coalesce(func.sum(ExercicioCampeonato.pontos), 0).label("pontos")
        ).select_from(user_campeonato)\
        .join(User, User.id == user_campeonato.c.user_id)\
        .join(Treino, Treino.user_id == User.id, isouter=True)\
        .join(UserExercicio, UserExercicio.treino_id == Treino.id, isouter=True)\
        .join(ExercicioCampeonato, UserExercicio.exec_campeonato_id == ExercicioCampeonato.id, isouter=True)\
        .where(user_campeonato.c.campeonato_id == campeonato_id)\
        .group_by(user_campeonato.c.user_id, User.username, User.fullname)\
        .order_by(func.coalesce(func.sum(ExercicioCampeonato.pontos), 0).desc())
    
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

@router.patch("/entrar/{campeonato_id}")
def sair_campeonato(campeonato_id: int, current_user: Annotated[User, Depends(get_current_user)]):
    with Session() as sess:
        campeonato = sess.scalar(select(Campeonato).where(Campeonato.id == campeonato_id))
        if not campeonato:
            raise HTTPException(status_code=402, detail="Campeonato não encontrado!")

        user = sess.scalar(select(User).where(User.id == current_user.id))
        if not user:
            raise HTTPException(status_code=402, detail="Usuário não encontrado!")

        user.campeonatos.append(campeonato)
        try:
            sess.commit()
            return True
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail="Erro ao entrar no campeonato.")

@router.patch("/sair/{campeonato_id}")
def sair_campeonato(campeonato_id: int, current_user: Annotated[User, Depends(get_current_user)]):
    with Session() as sess:
        campeonato = sess.scalar(select(Campeonato).where(Campeonato.id == campeonato_id))
        if not campeonato:
            raise HTTPException(status_code=402, detail="Campeonato não encontrado!")

        user = sess.scalar(select(User).where(User.id == current_user.id))
        if not user:
            raise HTTPException(status_code=402, detail="Usuário não encontrado!")

        user.campeonatos.remove(campeonato)
        try:
            sess.commit()
            return True
        except Exception as e:
            raise HTTPException(status_code=500, detail="Erro ao sair do campeonato.")