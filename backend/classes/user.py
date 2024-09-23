import datetime
from typing import List
from sqlalchemy import String, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.db import Base
from .user_skill import user_skill

class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    nickname: Mapped[str] = mapped_column(String(20), nullable=False)
    fullname: Mapped[str]
    email: Mapped[str]
    level: Mapped[int] = mapped_column(Integer, default=0)
    admin: Mapped[bool]
    nascimento: Mapped[datetime.date]
    classe_id = mapped_column(ForeignKey("classe.id"))

    classe: Mapped["Classe"] = relationship(back_populates="users")
    skills: Mapped[List["Skill"]] = relationship(secondary=user_skill)

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, name={self.name!r}, fullname={self.fullname!r})"