from fastapi import APIRouter, UploadFile, Form
from typing import List, Annotated
from models.user import User
from fastapi import Depends
from .login import get_current_user
from dtos.campeonato_model import CampeonatoModel
from services import campeonato_service

router = APIRouter(
    dependencies=[Depends(get_current_user)],
    tags=["campeonato"],
    prefix='/campeonato',
    responses={404: {"description": "Not found"}}
)

@router.post("/")
def add_campeonato(model: CampeonatoModel, current_user: Annotated[User, Depends(get_current_user)]):
    return campeonato_service.add_campeonato(model, current_user)

@router.get("/")
def get_campeonato(current_user: Annotated[User, Depends(get_current_user)]):
    return campeonato_service.get_campeonato(current_user)

@router.get("/pesquisa/{termo}")
def get_campeonato(current_user: Annotated[User, Depends(get_current_user)], termo: str):
    return campeonato_service.get_campeonato(current_user, termo)

@router.get("/detalhes/{campeonato_id}")
def get_campeonato_detalhes(current_user: Annotated[User, Depends(get_current_user)], campeonato_id: int):
    return campeonato_service.get_campeonato_detalhes(current_user, campeonato_id)

@router.get("/detalhes_progresso/{campeonato_id}")
def get_progresso(campeonato_id: int):
    return campeonato_service.get_progresso(campeonato_id)

@router.get("/atividades/{campeonato_id}")
def get_atividades(campeonato_id: int):
    return campeonato_service.get_atividades(campeonato_id)
    
@router.get("/atividade/{atividade_id}")
def get_atividade_by_id(atividade_id: int):
    return campeonato_service.get_atividade_by_id(atividade_id)

@router.post("/add-treino")
async def add_treino(
    current_user: Annotated[User, Depends(get_current_user)],
    imagem: UploadFile = Form(...),
    exercicios_ids: List[int] = Form(...), 
    latitude: float = Form(...),
    longitude: float = Form(...)
):
    return await campeonato_service.add_treino(current_user, imagem, exercicios_ids, latitude, longitude)

@router.delete("/{campeonato_id}")
def delete_campeonato(campeonato_id: int):
    return campeonato_service.delete_campeonato(campeonato_id)

@router.patch("/entrar/{campeonato_id}")
def sair_campeonato(campeonato_id: int, current_user: Annotated[User, Depends(get_current_user)]):
    return campeonato_service.sair_campeonato(campeonato_id, current_user)

@router.patch("/sair/{campeonato_id}")
def sair_campeonato(campeonato_id: int, current_user: Annotated[User, Depends(get_current_user)]):
    return campeonato_service.sair_campeonato(campeonato_id, current_user)
        
@router.get("/exercicios/{campeonato_id}")
def get_exercicios_treino(campeonato_id: int):
    return campeonato_service.get_exercicios_treino(campeonato_id)
    
@router.delete("/treino/{treino_id}")
def delete_treino(treino_id: int):
    return campeonato_service.delete_treino(treino_id)