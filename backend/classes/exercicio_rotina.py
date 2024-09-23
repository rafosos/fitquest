from sqlalchemy import ForeignKey, Column, Table, Integer
from db.db import Base

exercicio_rotina = Table(
    "exercicio_rotina",
    Base.metadata,
    Column("rotina_id", ForeignKey("rotina.id")),
    Column("exercicio_id", ForeignKey("exercicio.id")),
    Column("series", Integer),
    Column("repeticoes", Integer)
)