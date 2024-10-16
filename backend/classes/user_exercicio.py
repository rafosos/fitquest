from sqlalchemy import ForeignKey
from datetime import date
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from db.db import Base

class UserExercicio(Base):
    __tablename__ = "user_exercicio"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    exec_rotina_id: Mapped[int] = mapped_column(ForeignKey("exercicio_rotina.id"), nullable=True)
    exec_campeonato_id: Mapped[int] = mapped_column(ForeignKey("exercicio_campeonato.id"), nullable=True)
    data: Mapped[date] = mapped_column(server_default=func.now())
    
    user: Mapped["User"] = relationship(back_populates="exercicios")
    exec_rotina: Mapped["ExercicioRotina"] = relationship(back_populates="execs_user")
    exec_campeonato: Mapped["ExercicioCampeonato"] = relationship(back_populates="execs_user")