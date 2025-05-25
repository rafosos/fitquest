from fastapi import APIRouter, Depends, UploadFile, Form
from typing import List, Annotated
from models.user import User
from .login import get_current_user
from dtos.rotina_model import RotinaModel
from services import rotina_service

router = APIRouter(
    dependencies=[Depends(get_current_user)],
    tags=["rotina"],
    prefix='/rotina',
    responses={404: {"description": "Not found"}}
)

@router.post("/")
def add_rotina(current_user: Annotated[User, Depends(get_current_user)], model: RotinaModel):
    return rotina_service.add_rotina(current_user, model)

@router.get("/")
def get_rotina(current_user: Annotated[User, Depends(get_current_user)]):
    return rotina_service.get_rotina(current_user)

@router.get("/detalhes/{rotina_id}")
def get_rotina_detalhes(current_user: Annotated[User, Depends(get_current_user)], rotina_id: int):
    return rotina_service.get_rotina_detalhes(current_user, rotina_id)

@router.post("/treino/")
async def add_treino(
    current_user: Annotated[User, Depends(get_current_user)], 
    imagem: UploadFile = Form(...),
    ids_exercicios: List[int] = Form(...)
):
    return rotina_service.add_treino(current_user, imagem, ids_exercicios)

@router.delete("/{id}")
def delete_rotina(id: int, current_user: Annotated[User, Depends(get_current_user)]):
    return rotina_service.delete_rotina(id, current_user)

@router.get("/exercicios/{rotina_id}")
def get_exercicios_treino(rotina_id: int):
    return rotina_service.get_exercicios_treino(rotina_id)