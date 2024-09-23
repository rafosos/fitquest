from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey
from db.db import Base
import datetime

class Campeonato(Base):
    __tablename__ = "campeonato"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str]
    duracao: Mapped[datetime.datetime]

    def __repr__(self) -> str:
        return f"Exercicio(id={self.id!r}, nome={self.nome!r}, dificuldade_id={self.dificuldade_id!r})"