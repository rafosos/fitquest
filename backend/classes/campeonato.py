from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, func
from typing import List
from .base_class import Base
from .user_campeonato import user_campeonato
import datetime

class Campeonato(Base):
    __tablename__ = "campeonato"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str]
    duracao: Mapped[datetime.datetime]
    data_criacao: Mapped[datetime.date] = mapped_column(server_default=func.now())
    criado_por_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    exercicios: Mapped[List["ExercicioCampeonato"]] = relationship(back_populates="campeonato")
    treinos: Mapped[List["Treino"]] = relationship(back_populates="campeonato")
    users: Mapped[List["User"]] = relationship(secondary=user_campeonato)
    criador: Mapped["User"] = relationship()


    def __repr__(self) -> str:
        return f"Campeonato(id={self.id!r}, nome={self.nome!r}, duracao={self.duracao!r})"