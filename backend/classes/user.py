import datetime
from typing import List
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.db import Session
from .base_class import Base
from .user_skill import user_skill
from .user_campeonato import user_campeonato
from .skill import Skill
from .amizade import Amizade

class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(20), nullable=False, unique=True)
    fullname: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True)
    level: Mapped[int] = mapped_column(Integer, default=0)
    # peso: Mapped[float] = mapped_column(nullable=True)
    # altura: Mapped[float] = mapped_column(nullable=True)
    # status: Mapped[str] = mapped_column(nullable=True)
    # objetivo: Mapped[str] = mapped_column(nullable=True)
    admin: Mapped[bool]
    senha: Mapped[str]
    nascimento: Mapped[datetime.date]
    # classe_id = mapped_column(ForeignKey("classe.id"))


    # classe: Mapped["Classe"] = relationship(back_populates="users")
    treinos: Mapped[List["Treino"]] = relationship(back_populates="user")
    exercicios_custom: Mapped[List["Exercicio"]] = relationship(back_populates="user")
    skills: Mapped[List["Skill"]] = relationship(secondary=user_skill)
    campeonatos: Mapped[List["Campeonato"]] = relationship(secondary=user_campeonato)
    
    amizades_sent: Mapped[List["Amizade"]] = relationship("Amizade", foreign_keys=[Amizade.user1_id], back_populates="user1")
    amizades_received: Mapped[List["Amizade"]] = relationship("Amizade", foreign_keys=[Amizade.user2_id], back_populates="user2")

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, username={self.username!r}, fullname={self.fullname!r})"

    def add_user(self):
        with Session() as sess:
            ids = sess.query(Skill).all()
            self.skills.extend(ids)
        
        # self.skills.extend(Skill.select_all(Skill))
        
        # print(self.skills)
        self.add_self()