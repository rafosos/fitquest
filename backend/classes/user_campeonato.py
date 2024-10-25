from sqlalchemy import ForeignKey, Column, Table
from .base_class import Base

user_campeonato = Table(
    "user_campeonato",
    Base.metadata,
    Column("user_id", ForeignKey("user.id")),
    Column("campeonato_id", ForeignKey("campeonato.id"))
)