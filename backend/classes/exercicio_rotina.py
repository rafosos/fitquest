from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from db.db import Base
from typing import List

class ExercicioRotina(Base):
    __tablename__ = "exercicio_rotina"
    id: Mapped[int] = mapped_column(primary_key=True)
    exercicio_id: Mapped[int] = mapped_column(ForeignKey("exercicio.id"))
    rotina_id: Mapped[int] = mapped_column(ForeignKey("rotina.id"))
    qtd_serie: Mapped[int] = mapped_column(nullable=True)
    qtd_repeticoes: Mapped[int] = mapped_column(nullable=True)
    
    exercicio: Mapped["Exercicio"] = relationship(back_populates="rotinas")
    rotina: Mapped["Rotina"] = relationship(back_populates="exercicios")
    execs_user: Mapped[List["UserExercicio"]] = relationship(back_populates="exec_rotina")