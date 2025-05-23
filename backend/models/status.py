from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base_class import Base

class Status(Base):
    __tablename__ = "status"
    id: Mapped[int] = mapped_column(primary_key=True)
    descricao: Mapped[str]

    def add_by_name_array(self, name_array):
        new_values = [Status(descricao=n) for n in name_array]
        self.add_all(new_values=new_values)

    amizades: Mapped["Amizade"] = relationship(back_populates="status")