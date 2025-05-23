from fastapi import APIRouter, Response, status, HTTPException, Depends, UploadFile, Form
from typing import List, Annotated
from collections import defaultdict
from db.db import Session
from sqlalchemy import select, and_, literal_column
from pydantic import BaseModel
from models.exercicio import Exercicio
from models.treino_exercicio import TreinoExercicio
from models.user import User
from models.treino import Treino, TipoTreino
from models.rotina import Rotina
from models.grupo_muscular import GrupoMuscular
from models.exercicio_rotina import ExercicioRotina
from .login import get_current_user

router = APIRouter(
    dependencies=[Depends(get_current_user)],
    tags=["rotina"],
    prefix='/rotina',
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

@router.post("/")
def add_rotina(current_user: Annotated[User, Depends(get_current_user)], model: RotinaModel, res: Response):
    with Session() as sess:
        rotina = Rotina(user_id=current_user.id, nome=model.nome, dias=model.dias)
        sess.add(rotina)
        
        for exec in model.exercicios:
            exec_entidade = sess.scalar(select(Exercicio).where(Exercicio.id == exec.id))
            if exec_entidade is None:
                raise HTTPException(status_code=400, detail=f"Exercicio com id {exec.id} não encontrado")
            
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

@router.get("/")
def get_rotina(current_user: Annotated[User, Depends(get_current_user)]):
    stmt = (
        select(
            Rotina.id, 
            Rotina.nome, 
            Rotina.dias, 
            Exercicio.nome.label('exercicio_nome')
        )
        .join(ExercicioRotina, Rotina.id == ExercicioRotina.rotina_id)
        .join(Exercicio, ExercicioRotina.exercicio_id == Exercicio.id)
        .filter(Rotina.user_id == current_user.id)
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
                "exercicios": row[3]
            }
            continue

        rotinas_dict[rotina_id]["exercicios"] = rotinas_dict[rotina_id]["exercicios"] + f", {row[3]}"

    return [v for k,v in rotinas_dict.items()]

@router.get("/detalhes/{rotina_id}")
def get_rotina_detalhes(current_user: Annotated[User, Depends(get_current_user)], rotina_id: int):
    cte_ultimo_treino = select(Treino.data.label("ultimo_treino"), Treino.rotina_id)\
        .where(
            and_(
                Treino.tipo == TipoTreino.rotina, 
                Treino.user_id == current_user.id,
                Treino.rotina_id == rotina_id
            ))\
        .limit(1).order_by(Treino.data.desc()).cte("cte_ultimo_treino")
    
    stmt = (
        select(
            Rotina.id, 
            Rotina.nome, 
            Rotina.dias,
            literal_column("cte_ultimo_treino.ultimo_treino"),
            ExercicioRotina.id, 
            ExercicioRotina.qtd_serie, 
            ExercicioRotina.qtd_repeticoes, 
            Exercicio.nome.label('exercicio_nome'), 
            GrupoMuscular.id.label('grupo_muscular_id'), 
            GrupoMuscular.nome.label('grupo_muscular_nome')
        )
        .select_from(Rotina)
        .join(cte_ultimo_treino, literal_column("cte_ultimo_treino.rotina_id") == Rotina.id, isouter=True)
        .join(ExercicioRotina, Rotina.id == ExercicioRotina.rotina_id)
        .join(Exercicio, ExercicioRotina.exercicio_id == Exercicio.id)
        .join(GrupoMuscular, Exercicio.grupo_muscular_id == GrupoMuscular.id)
        .filter(Rotina.id == rotina_id)
    )
    with Session() as sess:
        result = sess.execute(stmt).all()

    rotina = None
    for row in result:

        if(rotina is None):
            rotina = {
                "id": row[0],
                "nome": row[1],
                "dias": row[2],
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

        rotina["exercicios"].append(exercicio_info)

    return rotina

class TreinoModel(BaseModel):
    rotinaId: int
    ids_exercicios: List[int]

@router.post("/treino/")
async def add_treino(
    current_user: Annotated[User, Depends(get_current_user)], 
    imagem: UploadFile = Form(...),
    ids_exercicios: List[int] = Form(...)
):
    with Session() as sess:
        result = sess.execute(
            select(ExercicioRotina.rotina_id, Rotina.nome)
            .select_from(ExercicioRotina)
            .join(Rotina, Rotina.id == ExercicioRotina.rotina_id)
            .where(ExercicioRotina.id == ids_exercicios[0])).first()
        imagebytes = await imagem.read()
        treino = Treino(user_id=current_user.id, rotina_id=result[0], nome=result[1], tipo=TipoTreino.rotina, imagem=imagebytes)
        exercicios = [TreinoExercicio(exec_rotina_id=id) for id in ids_exercicios]
        treino.exercicios = exercicios
        sess.add(treino)
        sess.commit()
    return "O novo treino foi adicionado com sucesso."

@router.delete("/{id}")
def delete_rotina(id: int, current_user: Annotated[User, Depends(get_current_user)], res: Response):
    with Session() as sess:
        rotina = sess.scalar(select(Rotina).where(and_(Rotina.id == id, Rotina.user_id == current_user.id)))
        sess.delete(rotina)
        sess.commit()
    res.status_code = status.HTTP_200_OK
    return "A rotina foi deletada com sucesso."

@router.get("/exercicios/{rotina_id}")
def get_exercicios_treino(rotina_id: int):
    with Session() as sess:
        stmt = select(
            ExercicioRotina.id,
            ExercicioRotina.exercicio_id,
            Exercicio.nome,
            GrupoMuscular.nome,
            ExercicioRotina.qtd_serie,
            ExercicioRotina.qtd_repeticoes
        ).select_from(ExercicioRotina)\
        .join(Exercicio, Exercicio.id == ExercicioRotina.exercicio_id)\
        .join(GrupoMuscular, Exercicio.grupo_muscular_id == GrupoMuscular.id)\
        .where(ExercicioRotina.rotina_id == rotina_id)

        return sess.execute(stmt).mappings().all()