import datetime
from typing import List
from sqlalchemy import String, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.db import Base, Session
from .user_skill import user_skill
from .user_campeonato import user_campeonato
from .skill import Skill
from .amizade import Amizade

class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    nickname: Mapped[str] = mapped_column(String(20), nullable=False, unique=True)
    fullname: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True)
    level: Mapped[int] = mapped_column(Integer, default=0)
    admin: Mapped[bool]
    senha: Mapped[str]
    nascimento: Mapped[datetime.date]
    # classe_id = mapped_column(ForeignKey("classe.id"))


    # classe: Mapped["Classe"] = relationship(back_populates="users")
    exercicios: Mapped[List["UserExercicio"]] = relationship(back_populates="user")
    exercicios_custom: Mapped[List["Exercicio"]] = relationship(back_populates="user")
    skills: Mapped[List["Skill"]] = relationship(secondary=user_skill)
    campeonatos: Mapped[List["Campeonato"]] = relationship(secondary=user_campeonato)
    
    amizades_sent: Mapped[List["Amizade"]] = relationship("Amizade", foreign_keys=[Amizade.user1_id], back_populates="user1")
    amizades_received: Mapped[List["Amizade"]] = relationship("Amizade", foreign_keys=[Amizade.user2_id], back_populates="user2")

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, nickname={self.nickname!r}, fullname={self.fullname!r})"

    def add_user(self):
        with Session() as sess:
            ids = sess.query(Skill).all()
            self.skills.extend(ids)
        
        # self.skills.extend(Skill.select_all(Skill))
        
        # print(self.skills)
        self.add_self()