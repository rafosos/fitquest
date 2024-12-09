from sqlalchemy import ForeignKey
from datetime import date
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from .base_class import Base
from .status import Status

class Amizade(Base):
    __tablename__ = "amizade"
    user1_id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)
    user2_id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)
    data: Mapped[date] = mapped_column(server_default=func.now())
    status_id: Mapped[int] = mapped_column(ForeignKey("status.id"), default=1)

    status: Mapped[Status] = relationship(back_populates="amizades")

    user1: Mapped["User"] = relationship("User", foreign_keys=[user1_id], back_populates="amizades_sent")
    user2: Mapped["User"] = relationship("User", foreign_keys=[user2_id], back_populates="amizades_received")