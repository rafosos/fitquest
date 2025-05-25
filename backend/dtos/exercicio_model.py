from pydantic import BaseModel

class ExercicioCampeonatoModel(BaseModel):
    exercicio_id: int
    qtd_serie: int
    qtd_repeticoes: int
    qtd_pontos: int

class ExercicioModel(BaseModel):
    nome: str
    dificuldade_id: int

class ExercicioRotinaModel(BaseModel):
    id: int
    series: int
    repeticoes: int