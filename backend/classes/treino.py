from sqlalchemy import ForeignKey, Enum, types
from datetime import date
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from .base_class import Base
from typing import List
import enum

class TipoTreino(enum.Enum):
    rotina = 1
    campeonato = 2

class StatusTreino(enum.Enum):
    ativo = 1
    deletado = 2

class Treino(Base):
    __tablename__ = "treino"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    rotina_id: Mapped[int] = mapped_column(ForeignKey("rotina.id"), nullable=True)
    campeonato_id: Mapped[int] = mapped_column(ForeignKey("campeonato.id"), nullable=True)
    nome: Mapped[str]
    tipo = mapped_column(type_=Enum(TipoTreino))
    data: Mapped[date] = mapped_column(server_default=func.now())
    status = mapped_column(type_=Enum(StatusTreino), default=StatusTreino.ativo)
    imagem = mapped_column(type_=types.LargeBinary, nullable=False)
    
    user: Mapped["User"] = relationship(back_populates="treinos")
    rotina: Mapped["Rotina"] = relationship(back_populates="treinos")
    campeonato: Mapped["Campeonato"] = relationship(back_populates="treinos")
    exercicios: Mapped[List["TreinoExercicio"]] = relationship(back_populates="treino", cascade="all,delete,delete-orphan")