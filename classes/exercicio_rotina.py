from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .base_class import Base
from typing import List

class ExercicioRotina(Base):
    __tablename__ = "exercicio_rotina"
    id: Mapped[int] = mapped_column(primary_key=True)
    exercicio_id: Mapped[int] = mapped_column(ForeignKey("exercicio.id"))
    rotina_id: Mapped[int] = mapped_column(ForeignKey("rotina.id"), nullable=True)
    qtd_serie: Mapped[int] = mapped_column(nullable=True)
    qtd_repeticoes: Mapped[int] = mapped_column(nullable=True)
    
    exercicio: Mapped["Exercicio"] = relationship(back_populates="rotinas")
    rotina: Mapped["Rotina"] = relationship(back_populates="exercicios")
    execs_user: Mapped[List["UserExercicio"]] = relationship(back_populates="exec_rotina")

    def __repr__(self) -> str:
        return f"ExercicioRotina(id={self.id!r}, exercicio_id={self.exercicio_id!r}, rotina_id={self.rotina_id!r}), qtd_serie={self.qtd_serie!r}), qtd_repeticoes={self.qtd_repeticoes!r})"
    