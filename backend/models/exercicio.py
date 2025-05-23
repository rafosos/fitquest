from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from typing import List
from .base_class import Base

class Exercicio(Base):
    __tablename__ = "exercicio"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str]
    grupo_muscular_id = mapped_column(ForeignKey("grupo_muscular.id"))
    criado_por = mapped_column(ForeignKey("user.id"), nullable=True)

    grupo_muscular: Mapped["GrupoMuscular"] = relationship(back_populates="exercicios")
    user: Mapped["User"] = relationship(back_populates="exercicios_custom")
    campeonatos: Mapped["ExercicioCampeonato"] = relationship(back_populates="exercicio")
    rotinas: Mapped[List["ExercicioRotina"]] = relationship(back_populates="exercicio")

    def add_by_name_array(self, name_array):
        new_values = [Exercicio(nome=n["nome"], grupo_muscular_id=n["grupo_muscular_id"]) for n in name_array]
        self.add_all(new_values=new_values)

    def __repr__(self) -> str:
        return f"Exercicio(id={self.id!r}, nome={self.nome!r}, grupo_muscular_id={self.grupo_muscular_id!r})"