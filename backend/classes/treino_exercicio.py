from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .base_class import Base

class TreinoExercicio(Base):
    __tablename__ = "treino_exercicio"
    id: Mapped[int] = mapped_column(primary_key=True)
    treino_id: Mapped[int] = mapped_column(ForeignKey("treino.id"))
    exec_rotina_id: Mapped[int] = mapped_column(ForeignKey("exercicio_rotina.id"), nullable=True)
    exec_campeonato_id: Mapped[int] = mapped_column(ForeignKey("exercicio_campeonato.id"), nullable=True)
    
    treino: Mapped["Treino"] = relationship(back_populates="exercicios")
    exec_rotina: Mapped["ExercicioRotina"] = relationship(back_populates="execs_user")
    exec_campeonato: Mapped["ExercicioCampeonato"] = relationship(back_populates="execs_user")