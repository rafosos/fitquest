from fastapi import APIRouter, Body, Depends
from typing import Annotated
from models.user import User
from .login import get_current_user
from services import user_service
import logging
logger = logging.getLogger("api")

router = APIRouter(
    dependencies=[Depends(get_current_user)],
    tags=["user"],
    prefix='/user',
)

@router.post("/add-amigo/{amigo_id}")
def add_amigo(amigo_id: int, current_user: Annotated[User, Depends(get_current_user)]):
    return user_service.add_amigo(amigo_id, current_user.id)

@router.get("/get-amigos")
def get_amigos(current_user: Annotated[User, Depends(get_current_user)]):
    return user_service.get_amigos(current_user.id)
    
@router.get("/get-amigos/{filtro}")
def get_amigos(current_user: Annotated[User, Depends(get_current_user)], filtro):
    return user_service.get_amigos(current_user.id, filtro)
    
@router.get("/get-nao-amigos/{filtro}")
def get_nao_amigos(current_user: Annotated[User, Depends(get_current_user)], filtro):
    return user_service.get_nao_amigos(current_user.id, filtro)
    
@router.get("/get-pedidos-amizade/")
def get_pedidos_amizade(current_user: Annotated[User, Depends(get_current_user)]):
    return user_service.get_pedidos_amizade(current_user.id)
    
@router.get("/informacoes/")
def get_informacoes_usuario(current_user: Annotated[User, Depends(get_current_user)]):
    return user_service.get_informacoes_usuario(current_user.id)
    
@router.put("/status-pedido-amizade/")
def change_status_pedido_amizade(
    current_user: Annotated[User, Depends(get_current_user)], 
    id: Annotated[int, Body()], 
    status: Annotated[int, Body()]):
    return user_service.change_status_pedido_amizade(current_user.id, id, status)

@router.delete("/delete-pedido-amizade/{id}")
def delete_pedido_amizade(current_user: Annotated[User, Depends(get_current_user)], id: int):
    return user_service.delete_pedido_amizade(current_user.id, id)
    
@router.delete("/delete-amizade/{id}")
def delete_amizade(current_user: Annotated[User, Depends(get_current_user)], id: int):
    return user_service.delete_amizade(current_user.id, id)
        
@router.patch("/editar/{campo}")
def editar_altura(current_user: Annotated[User, Depends(get_current_user)], campo: str, valor: str = Body(..., embed=True)):
    return user_service.editar_altura(current_user.id, campo, valor)
    
@router.get("/perfil-configuracoes/")
def get_perfil_configs(current_user: Annotated[User, Depends(get_current_user)]):
    return user_service.get_perfil_configs(current_user.id)
    
@router.get("/perfil/{amigo_id}")
def get_user_perfil(current_user: Annotated[User, Depends(get_current_user)], amigo_id: int):
    return user_service.get_user_perfil(current_user.id, amigo_id)