from dtos.campeonato_model import CampeonatoModel
from fastapi import UploadFile, HTTPException
from assets.utils import verificar_coordenada_dentro
from models.user import User
from db.db import Session
import base64
from models.exercicio_campeonato import ExercicioCampeonato
from models.campeonato import Campeonato
from models.status import Status
from models.amizade import Amizade
from models.treino import Treino, TipoTreino
from typing import List
from models.exercicio import Exercicio
from models.grupo_muscular import GrupoMuscular
from models.user_campeonato import user_campeonato
from models.treino_exercicio import TreinoExercicio
from assets.dump_db import statuses
from sqlalchemy.orm import selectinload, aliased
from sqlalchemy import select, func, and_, case, or_, literal, literal_column

def add_campeonato(model: CampeonatoModel, current_user: User):
    model.participantes_ids.append(current_user.id)
    
    with Session() as sess:
        participantes = sess.scalars(select(User).where(User.id.in_(model.participantes_ids))).all()
        exercicios = [ExercicioCampeonato(exercicio_id=e.exercicio_id, qtd_serie=e.qtd_serie, qtd_repeticoes=e.qtd_repeticoes, pontos=e.qtd_pontos) for e in model.exercicios]

        camp = Campeonato(nome=model.nome, duracao=model.duracao, criado_por_id=model.participantes_ids[-1], latitude=model.latitude, longitude=model.longitude)
        camp.users.extend(participantes)
        camp.exercicios.extend(exercicios)
        sess.add(camp)
        sess.commit()
        return camp.id

def get_campeonato(current_user: User):
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

def get_campeonato(current_user: User, termo: str):
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

def get_campeonato_detalhes(current_user: User, campeonato_id: int):
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

def get_progresso(campeonato_id: int):
    with Session() as sess:
        stmt = select(
            user_campeonato.c.user_id,
            User.username,
            User.fullname,
            func.coalesce(func.sum(ExercicioCampeonato.pontos), 0).label("pontos")
        ).select_from(user_campeonato)\
        .join(User, User.id == user_campeonato.c.user_id)\
        .join(Treino, and_(Treino.user_id == User.id, Treino.campeonato_id == user_campeonato.c.campeonato_id), isouter=True)\
        .join(TreinoExercicio, TreinoExercicio.treino_id == Treino.id, isouter=True)\
        .join(ExercicioCampeonato, TreinoExercicio.exec_campeonato_id == ExercicioCampeonato.id, isouter=True)\
        .where(user_campeonato.c.campeonato_id == campeonato_id)\
        .group_by(user_campeonato.c.user_id, User.username, User.fullname)\
        .order_by(func.coalesce(func.sum(ExercicioCampeonato.pontos), 0).desc())
    
        return sess.execute(stmt).mappings().all()
    
def get_atividades(campeonato_id: int):
    with Session() as sess:
        stmt = select(
            Treino.id,
            Treino.user_id,
            Treino.data,
            Treino.imagem,
            User.username,
            User.fullname,
            func.sum(ExercicioCampeonato.pontos).label("pontos"),
            func.string_agg(Exercicio.nome, ', ').label("exercicios")
        ).select_from(Treino)\
        .join(User, User.id == Treino.user_id)\
        .join(TreinoExercicio, TreinoExercicio.treino_id == Treino.id)\
        .join(ExercicioCampeonato, ExercicioCampeonato.id == TreinoExercicio.exec_campeonato_id)\
        .join(Exercicio, Exercicio.id == ExercicioCampeonato.exercicio_id)\
        .where(Treino.campeonato_id == campeonato_id)\
        .group_by(Treino.id, Treino.user_id, Treino.imagem, Treino.data, User.fullname, User.username)

        res = sess.execute(stmt).mappings().all()

        resultMap = []
        for row in res:
            img = base64.b64encode(row["imagem"]).decode('utf-8')
            resultMap.append({**row, "imagem": img})

        return resultMap
    
def get_atividade_by_id(atividade_id: int):
    with Session() as sess:
        stmt = select(
            Treino.id,
            Treino.user_id,
            Treino.data,
            Treino.imagem,
            User.username,
            User.fullname,
            ExercicioCampeonato.exercicio_id,
            ExercicioCampeonato.qtd_repeticoes,
            ExercicioCampeonato.qtd_serie,
            ExercicioCampeonato.pontos,
            Exercicio.nome
        ).select_from(Treino)\
        .join(User, User.id == Treino.user_id)\
        .join(TreinoExercicio, TreinoExercicio.treino_id == Treino.id)\
        .join(ExercicioCampeonato, ExercicioCampeonato.id == TreinoExercicio.exec_campeonato_id)\
        .join(Exercicio, Exercicio.id == ExercicioCampeonato.exercicio_id)\
        .where(Treino.id == atividade_id)

        res = sess.execute(stmt).mappings().all()

        resultMap = dict()
        for row in res:
            
            if resultMap.get("id", None) is None:
                img = base64.b64encode(row["imagem"]).decode('utf-8')
                resultMap = {
                    "id": row["id"],
                    "user_id": row["user_id"],
                    "data": row["data"], 
                    "imagem": img,
                    "pontos": 0, 
                    "username": row["username"],
                    "fullname": row["fullname"],
                    "exercicios": []}

            resultMap["pontos"] = resultMap["pontos"] + row["pontos"] 
            resultMap["exercicios"].append({
                "id": row["exercicio_id"], 
                "pontos:": row["pontos"],
                "qtd_repeticoes": row["qtd_repeticoes"],
                "qtd_serie": row["qtd_serie"],
                "nome": row["nome"]
            })

        return resultMap
    
async def add_treino(
    current_user: User,
    imagem: UploadFile,
    exercicios_ids: List[int], 
    latitude: float,
    longitude: float
):
    with Session() as sess:
        result = sess.execute(
            select(
                ExercicioCampeonato.campeonato_id,
                Campeonato.nome,
                Campeonato.latitude,
                Campeonato.longitude
            )  
            .select_from(ExercicioCampeonato)
            .join(Campeonato, ExercicioCampeonato.campeonato_id == Campeonato.id)
            .where(ExercicioCampeonato.id == exercicios_ids[0])).first()
        
        if not verificar_coordenada_dentro(latC=result[2], lonC=result[3], lonT=longitude, latT=latitude):
            raise HTTPException(400, "A coordenada está fora do raio do campeonato.")

        imagebytes = await imagem.read()
        treino = Treino(user_id=current_user.id, campeonato_id=result[0], nome=result[1], tipo=TipoTreino.campeonato, imagem=imagebytes)
        exercicios = [TreinoExercicio(exec_campeonato_id=id) for id in exercicios_ids]
        treino.exercicios = exercicios
        sess.add(treino)
        sess.commit()
    return "O novo treino foi adicionado com sucesso."

def delete_campeonato(campeonato_id: int):
    with Session() as sess:
        campeonato = sess.scalar(select(Campeonato)
                                 .options(selectinload(Campeonato.exercicios))
                                 .where(Campeonato.id == campeonato_id)
                                )
        sess.delete(campeonato)
        sess.commit()
    return "O campeonato foi deletado com sucesso"

def sair_campeonato(campeonato_id: int, current_user: User):
    with Session() as sess:
        campeonato = sess.scalar(select(Campeonato).where(Campeonato.id == campeonato_id))
        if not campeonato:
            raise HTTPException(status_code=400, detail="Campeonato não encontrado!")

        user = sess.scalar(select(User).where(User.id == current_user.id))
        if not user:
            raise HTTPException(status_code=400, detail="Usuário não encontrado!")

        user.campeonatos.append(campeonato)
        try:
            sess.commit()
            return True
        except Exception as e:
            raise HTTPException(status_code=500, detail="Erro ao entrar no campeonato.")

def sair_campeonato(campeonato_id: int, current_user: User):
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

def get_exercicios_treino(campeonato_id: int):
    with Session() as sess:
        stmt = select(
            ExercicioCampeonato.id,
            ExercicioCampeonato.exercicio_id,
            Exercicio.nome,
            GrupoMuscular.nome,
            ExercicioCampeonato.qtd_serie,
            ExercicioCampeonato.qtd_repeticoes,
            ExercicioCampeonato.pontos,
        ).select_from(ExercicioCampeonato)\
        .join(Exercicio, Exercicio.id == ExercicioCampeonato.exercicio_id)\
        .join(GrupoMuscular, Exercicio.grupo_muscular_id == GrupoMuscular.id)\
        .where(ExercicioCampeonato.campeonato_id == campeonato_id)

        return sess.execute(stmt).mappings().all()
    
def delete_treino(treino_id: int):
    with Session() as sess:
        treino = sess.scalar(select(Treino)
                                 .options(selectinload(Treino.exercicios))
                                 .where(Treino.id == treino_id)
                                )
        sess.delete(treino)
        sess.commit()
    return "O treino foi deletado com sucesso"