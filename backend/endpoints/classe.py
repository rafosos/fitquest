from fastapi import APIRouter
from db.db import Session
from classes.classe import Classe

router = APIRouter(
    tags=["classe"],
    responses={404: {"description": "Not found"}}
)

@router.get("/classe")
def get_classes():
    with Session() as sess:
        result = Classe.select_all(Classe, sess)
        return [{"id": r[0].id, "nome": r[0].nome} for r in result.all()]
