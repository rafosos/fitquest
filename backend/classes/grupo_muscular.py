from typing import List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.db import Base
from .exercicio import Exercicio

class GrupoMuscular(Base):
    __tablename__ = "grupo_muscular"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str]

    exercicios: Mapped[List["Exercicio"]] = relationship(back_populates="grupo_muscular")
         
    def add_by_name_array(self, name_array):
        new_values = [GrupoMuscular(nome=n) for n in name_array]
        self.add_all(new_values=new_values)

    def __repr__(self) -> str:
        return f"GrupoMuscular(id={self.id!r}, nome={self.nome!r})"

grupos_musculares = [
    "Peito",           # 1
    "Costas",          # 2
    "Ombros",          # 3
    "Tríceps",         # 4
    "Bíceps",          # 5
    "Pernas",          # 6
    "Panturrilha",     # 7
    "Abdômen",          # 8
    "Cardio",          # 9
]

def insert_grupos_musculares():
    if not GrupoMuscular.select_one(GrupoMuscular):
        GrupoMuscular.add_by_name_array(GrupoMuscular, grupos_musculares)