from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from typing import List
from db.db import Base

class Rotina(Base):
    __tablename__ = "rotina"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str]
    dias: Mapped[int]
    user_id = mapped_column(ForeignKey("user.id"))

    exercicios: Mapped[List["ExercicioRotina"]] = relationship(back_populates="rotina")


    def __repr__(self) -> str:
        return f"Rotina(id={self.id!r}, nome={self.nome!r}, dias={self.dias!r}, user_id={self.user_id!r})"