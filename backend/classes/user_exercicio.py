from sqlalchemy import ForeignKey
from datetime import date
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from db.db import Base

class UserExercicio(Base):
    __tablename__ = "user_exercicio"
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)
    exec_rotina_id: Mapped[int] = mapped_column(ForeignKey("exercicio_rotina.id"), primary_key=True, nullable=True)
    exec_exercicio_id: Mapped[int] = mapped_column(ForeignKey("exercicio_campeonato.id"), primary_key=True, nullable=True)
    data: Mapped[date] = mapped_column(server_default=func.now())
    
    user: Mapped["User"] = relationship(back_populates="exercicios")
    exec_rotina: Mapped["ExercicioRotina"] = relationship(back_populates="execs_user")
    exec_campeonato: Mapped["ExercicioCampeonato"] = relationship(back_populates="execs_user")