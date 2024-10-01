from sqlalchemy import ForeignKey
import datetime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from db.db import Base
from .status import Status

class Amizade(Base):
    __tablename__ = "amizade"
    user1_id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)
    user2_id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)
    data: Mapped[datetime.date]
    status_id: Mapped[int] = mapped_column(ForeignKey("status.id"))

    status: Mapped[Status] = relationship(back_populates="amizades")

    user1: Mapped["User"] = relationship(back_populates="amigos", foreign_keys=user1_id)
    user2: Mapped["User"] = relationship(back_populates="adicionaram", foreign_keys=user2_id)