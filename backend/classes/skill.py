from sqlalchemy.orm import Mapped, mapped_column
from db.db import Base

class Skill(Base):
    __tablename__ = "skill"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str]

    def __repr__(self) -> str:
        return f"Skill(id={self.id!r}, nome={self.nome!r})"