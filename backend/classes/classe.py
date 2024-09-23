from typing import List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.db import Base
from .user import User

class Classe(Base):
    __tablename__ = "classe"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str]

    users: Mapped[List["User"]] = relationship(back_populates="classe")

    def __repr__(self) -> str:
        return f"Classe(id={self.id!r}, nome={self.nome!r})"