from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.db import Base

class Status(Base):
    __tablename__ = "status"
    id: Mapped[int] = mapped_column(primary_key=True)
    descricao: Mapped[str]

    def add_by_name_array(self, name_array):
        new_values = [Status(descricao=n) for n in name_array]
        self.add_all(new_values=new_values)

    amizades: Mapped["Amizade"] = relationship(back_populates="status")

statuses = ["Ativa", "Pendente", "Bloqueado"]

def insert_statuses():
    if not Status.select_one(Status):
        Status.add_by_name_array(Status, statuses)