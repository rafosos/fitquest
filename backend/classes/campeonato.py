from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from .base_class import Base
from .user_campeonato import user_campeonato
import datetime

class Campeonato(Base):
    __tablename__ = "campeonato"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str]
    duracao: Mapped[datetime.datetime]

    exercicios: Mapped[List["ExercicioCampeonato"]] = relationship(back_populates="campeonato")
    treinos: Mapped[List["Treino"]] = relationship(back_populates="campeonato")
    users: Mapped[List["User"]] = relationship(secondary=user_campeonato)


    def __repr__(self) -> str:
        return f"Campeonato(id={self.id!r}, nome={self.nome!r}, duracao={self.duracao!r})"