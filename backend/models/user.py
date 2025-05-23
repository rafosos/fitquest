import datetime
from typing import List
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base_class import Base
from .user_campeonato import user_campeonato
from .amizade import Amizade

class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(20), nullable=False, unique=True)
    fullname: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True)
    level: Mapped[int] = mapped_column(Integer, default=0)
    peso: Mapped[float] = mapped_column(nullable=True)
    altura: Mapped[float] = mapped_column(nullable=True)
    status: Mapped[str] = mapped_column(nullable=True)
    admin: Mapped[bool]
    senha: Mapped[str]
    nascimento: Mapped[datetime.date]

    treinos: Mapped[List["Treino"]] = relationship(back_populates="user")
    exercicios_custom: Mapped[List["Exercicio"]] = relationship(back_populates="user")
    campeonatos: Mapped[List["Campeonato"]] = relationship(secondary=user_campeonato)

    amizades_sent: Mapped[List["Amizade"]] = relationship("Amizade", foreign_keys=[Amizade.user1_id], back_populates="user1")
    amizades_received: Mapped[List["Amizade"]] = relationship("Amizade", foreign_keys=[Amizade.user2_id], back_populates="user2")

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, username={self.username!r}, fullname={self.fullname!r})"