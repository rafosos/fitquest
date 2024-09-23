from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from db.db import Base

class Exercicio(Base):
    __tablename__ = "exercicio"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str]
    dificuldade_id = mapped_column(ForeignKey("dificuldade.id"))

    dificuldade: Mapped["Dificuldade"] = relationship(back_populates="exercicios")

    def __repr__(self) -> str:
        return f"Exercicio(id={self.id!r}, nome={self.nome!r}, dificuldade_id={self.dificuldade_id!r})"