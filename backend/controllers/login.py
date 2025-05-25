from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from dtos.login_models import CadastroModel
from services import login_service

router = APIRouter(
    tags=["conta"],
    responses={
        401: {"description": "Not authorized"},
        404: {"description": "Not found"}}
)

@router.post("/cadastro")
def cadastro(form: CadastroModel):
    return login_service.cadastro(form)

@router.post("/login")
def login(form: Annotated[OAuth2PasswordRequestForm, Depends()]):
    return login_service.login(form)