from sqlalchemy.orm import Mapped, mapped_column
from db.db import Base

class Item(Base):
    __tablename__ = "item"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str]
    descricao: Mapped[str]

    def __repr__(self) -> str:
        return f"Item(id={self.id!r}, nome={self.nome!r})"