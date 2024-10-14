from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from db.db import Base

class Exercicio(Base):
    __tablename__ = "exercicio"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str]
    grupo_muscular_id = mapped_column(ForeignKey("grupo_muscular.id"))
    criado_por = mapped_column(ForeignKey("user.id"), nullable=True)

    grupo_muscular: Mapped["GrupoMuscular"] = relationship(back_populates="exercicios")
    user: Mapped["User"] = relationship(back_populates="exercicios_custom")
    campeonatos: Mapped["ExercicioCampeonato"] = relationship(back_populates="exercicio")
    rotinas: Mapped["ExercicioRotina"] = relationship(back_populates="exercicio")

    def add_by_name_array(self, name_array):
        new_values = [Exercicio(nome=n["nome"], grupo_muscular_id=n["grupo_muscular_id"]) for n in name_array]
        self.add_all(new_values=new_values)

    def __repr__(self) -> str:
        return f"Exercicio(id={self.id!r}, nome={self.nome!r}, dificuldade_id={self.dificuldade_id!r})"
    
exercicios = [
    {"nome": "Supino reto", "grupo_muscular_id": 1},
    {"nome": "Supino inclinado", "grupo_muscular_id": 1},
    {"nome": "Supino declinado", "grupo_muscular_id": 1},
    {"nome": "Pulley frente", "grupo_muscular_id": 2},
    {"nome": "Pulley costas", "grupo_muscular_id": 2},
    {"nome": "Remada baixa", "grupo_muscular_id": 2},
    {"nome": "Remada curvada", "grupo_muscular_id": 2},
    {"nome": "Remada unilateral", "grupo_muscular_id": 2},
    {"nome": "Remada serrote", "grupo_muscular_id": 2},
    {"nome": "Desenvolvimento com barra", "grupo_muscular_id": 3},
    {"nome": "Desenvolvimento com halteres", "grupo_muscular_id": 3},
    {"nome": "Elevação lateral", "grupo_muscular_id": 3},
    {"nome": "Elevação frontal", "grupo_muscular_id": 3},
    {"nome": "Crucifixo reto", "grupo_muscular_id": 1},
    {"nome": "Crucifixo inclinado", "grupo_muscular_id": 1},
    {"nome": "Puxada alta", "grupo_muscular_id": 2},
    {"nome": "Puxada no graviton", "grupo_muscular_id": 2},
    {"nome": "Voador peitoral", "grupo_muscular_id": 1},
    {"nome": "Voador inverso", "grupo_muscular_id": 2},
    {"nome": "Crossover", "grupo_muscular_id": 1},
    {"nome": "Tríceps corda", "grupo_muscular_id": 4},
    {"nome": "Tríceps testa", "grupo_muscular_id": 4},
    {"nome": "Tríceps pulley", "grupo_muscular_id": 4},
    {"nome": "Tríceps francês", "grupo_muscular_id": 4},
    {"nome": "Tríceps banco", "grupo_muscular_id": 4},
    {"nome": "Rosca direta", "grupo_muscular_id": 5},
    {"nome": "Rosca alternada", "grupo_muscular_id": 5},
    {"nome": "Rosca concentrada", "grupo_muscular_id": 5},
    {"nome": "Rosca martelo", "grupo_muscular_id": 5},
    {"nome": "Rosca Scott", "grupo_muscular_id": 5},
    {"nome": "Rosca inversa", "grupo_muscular_id": 5},
    {"nome": "Agachamento livre", "grupo_muscular_id": 6},
    {"nome": "Agachamento Smith", "grupo_muscular_id": 6},
    {"nome": "Agachamento sumô", "grupo_muscular_id": 6},
    {"nome": "Leg press", "grupo_muscular_id": 6},
    {"nome": "Hack machine", "grupo_muscular_id": 6},
    {"nome": "Extensão de pernas", "grupo_muscular_id": 6},
    {"nome": "Flexão de pernas", "grupo_muscular_id": 6},
    {"nome": "Cadeira adutora", "grupo_muscular_id": 6},
    {"nome": "Cadeira abdutora", "grupo_muscular_id": 6},
    {"nome": "Levantamento terra", "grupo_muscular_id": 6},
    {"nome": "Stiff com barra", "grupo_muscular_id": 6},
    {"nome": "Stiff com halteres", "grupo_muscular_id": 6},
    {"nome": "Passada", "grupo_muscular_id": 6},
    {"nome": "Avanço com barra", "grupo_muscular_id": 6},
    {"nome": "Avanço com halteres", "grupo_muscular_id": 6},
    {"nome": "Panturrilha em pé", "grupo_muscular_id": 7},
    {"nome": "Panturrilha sentado", "grupo_muscular_id": 7},
    {"nome": "Abdominal supra", "grupo_muscular_id": 8},
    {"nome": "Abdominal infra", "grupo_muscular_id": 8},
    {"nome": "Abdominal oblíquo", "grupo_muscular_id": 8},
    {"nome": "Abdominal na prancha", "grupo_muscular_id": 8},
    {"nome": "Prancha isométrica", "grupo_muscular_id": 8},
    {"nome": "Abdominal na roda", "grupo_muscular_id": 8},
    {"nome": "Elevação de pernas", "grupo_muscular_id": 8},
    {"nome": "Elevação de quadril", "grupo_muscular_id": 8}
]

def insert_exercicios():
    if not Exercicio.select_one(Exercicio):
        Exercicio.add_by_name_array(Exercicio, exercicios)