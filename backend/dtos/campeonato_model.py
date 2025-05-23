from pydantic import BaseModel
from datetime import datetime
from .exercicio_model import ExercicioModel

class CampeonatoModel(BaseModel):
    nome: str
    duracao: datetime
    participantes_ids: list[int]
    exercicios: list[ExercicioModel]
    latitude: float
    longitude: float