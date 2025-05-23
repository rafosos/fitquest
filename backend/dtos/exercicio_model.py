from pydantic import BaseModel

class ExercicioModel(BaseModel):
    exercicio_id: int
    qtd_serie: int
    qtd_repeticoes: int
    qtd_pontos: int