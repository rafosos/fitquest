from sqlalchemy import ForeignKey, Column, Table, Integer
from db.db import Base

user_skill = Table(
    "user_skill",
    Base.metadata,
    Column("user_id", ForeignKey("user.id")),
    Column("skill_id", ForeignKey("skill.id")),
    Column("value", Integer, default=0)
)