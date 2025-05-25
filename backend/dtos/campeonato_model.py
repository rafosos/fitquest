from pydantic import BaseModel
from datetime import datetime
from .exercicio_model import ExercicioCampeonatoModel

class CampeonatoModel(BaseModel):
    nome: str
    duracao: datetime
    participantes_ids: list[int]
    exercicios: list[ExercicioCampeonatoModel]
    latitude: float
    longitude: float