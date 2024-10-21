from sqlalchemy import ForeignKey
from datetime import date
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from db.db import Base
from typing import List

class Treino(Base):
    __tablename__ = "treino"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    rotina_id: Mapped[int] = mapped_column(ForeignKey("rotina.id"), nullable=True)
    campeonato_id: Mapped[int] = mapped_column(ForeignKey("campeonato.id"), nullable=True)
    data: Mapped[date] = mapped_column(server_default=func.now())
    
    user: Mapped["User"] = relationship(back_populates="treinos")
    rotina: Mapped["Rotina"] = relationship(back_populates="treinos")
    campeonato: Mapped["Campeonato"] = relationship(back_populates="treinos")
    exercicios: Mapped[List["UserExercicio"]] = relationship(back_populates="treino")