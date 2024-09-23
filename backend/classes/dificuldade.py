from typing import List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.db import Base
from .exercicio import Exercicio

class Dificuldade(Base):
    __tablename__ = "dificuldade"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str]

    exercicios: Mapped[List["Exercicio"]] = relationship(back_populates="dificuldade")

    def __repr__(self) -> str:
        return f"Dificuldade(id={self.id!r}, nome={self.nome!r})"