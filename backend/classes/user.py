import datetime
from typing import List
from sqlalchemy import String, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.db import Base, Session
from .user_skill import user_skill
from .skill import Skill

class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    nickname: Mapped[str] = mapped_column(String(20), nullable=False)
    fullname: Mapped[str]
    email: Mapped[str]
    level: Mapped[int] = mapped_column(Integer, default=0)
    admin: Mapped[bool]
    senha: Mapped[str]
    nascimento: Mapped[datetime.date]
    classe_id = mapped_column(ForeignKey("classe.id"))

    classe: Mapped["Classe"] = relationship(back_populates="users")
    skills: Mapped[List["Skill"]] = relationship(secondary=user_skill)

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, nickname={self.nickname!r}, fullname={self.fullname!r})"

    def add_user(self):
        with Session() as sess:
            ids = sess.query(Skill).all()
            print(ids)
            self.skills.extend(ids)
        
        # self.skills.extend(Skill.select_all(Skill))
        
        # print(self.skills)
        self.add_self()