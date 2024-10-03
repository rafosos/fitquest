from sqlalchemy import ForeignKey
from datetime import date
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from db.db import Base

class ExercicioCampeonato(Base):
    __tablename__ = "exercicio_campeonato"
    id: Mapped[int] = mapped_column(primary_key=True)
    exercicio_id: Mapped[int] = mapped_column(ForeignKey("exercicio.id"))
    campeonato_id: Mapped[int] = mapped_column(ForeignKey("campeonato.id"))
    data: Mapped[date] = mapped_column(server_default=func.now())
    
    exercicio: Mapped["Exercicio"] = relationship(back_populates="campeonatos")
    campeonato: Mapped["Campeonato"] = relationship(back_populates="exercicios")
    execs_user: Mapped["UserExercicio"] = relationship(back_populates="exec_campeonato")