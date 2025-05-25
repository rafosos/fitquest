from fastapi import APIRouter, Query, Body, Request
from typing import Annotated
from models.user import User
from models.treino import StatusTreino
from fastapi import Depends
from .login import get_current_user
from services import exercicio_service
from dtos.exercicio_model import ExercicioModel

router = APIRouter(
    tags=["exercicio"],
    prefix="/exercicio",
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}}
)

@router.post("/add-exec")
def add_exec(model: ExercicioModel):
    return exercicio_service.add_exec(model)
    
@router.get("/")
def get_exercicios(current_user: Annotated[User, Depends(get_current_user)], f: str, ids_escolhidos: Annotated[list[int] | None, Query()] = []):
    return exercicio_service.get_exercicios(current_user, f, ids_escolhidos)

@router.get("/treinos_resumo/{amigoId}")
async def get_treinos_resumo(current_user: Annotated[User, Depends(get_current_user)], amigoId: int, request: Request):
    return exercicio_service.get_treinos_resumo(current_user, amigoId)

@router.get("/streak_dia/")
def get_streak_dia(current_user: Annotated[User, Depends(get_current_user)]):
    return exercicio_service.get_streak_dia(current_user)

@router.get("/streak_semana/")
def get_streak_semana(current_user: Annotated[User, Depends(get_current_user)]):
    return exercicio_service.get_streak_semana(current_user)

@router.get("/streak_geral/")
def get_streaks_geral(current_user: Annotated[User, Depends(get_current_user)]):
    return exercicio_service.get_streaks_geral(current_user)
    
@router.patch("/{treino_id}")
def atualizar_status_treino(treino_id: int, status: StatusTreino = Body(..., embed=True)):
    return exercicio_service.atualizar_status_treino(treino_id, status)
    
@router.get("/get_deletados/")
def get_treinos_deletados(current_user: Annotated[User, Depends(get_current_user)]):
    return exercicio_service.get_treinos_deletados(current_user)