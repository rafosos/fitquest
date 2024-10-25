from sqlalchemy.orm import Mapped, mapped_column
from .base_class import Base

class Skill(Base):
    __tablename__ = "skill"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str]

    def __repr__(self) -> str:
        return f"Skill(id={self.id!r}, nome={self.nome!r})"
    
    def add_by_name_array(self, name_array):
        new_values = [Skill(nome=n) for n in name_array]
        self.add_all(new_values=new_values)

skills = ["Agilidade", "Força"]

def insert_skills():
    print(Skill.select_one(Skill))
    if not Skill.select_one(Skill):
        Skill.add_by_name_array(Skill, skills)
