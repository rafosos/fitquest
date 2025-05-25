from pydantic import BaseModel
from .exercicio_model import ExercicioRotinaModel
from typing import List

class RotinaModel(BaseModel):
    nome: str
    dias: int
    exercicios: List[ExercicioRotinaModel]

class TreinoModel(BaseModel):
    rotinaId: int
    ids_exercicios: List[int]
