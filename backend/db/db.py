from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

engine = create_engine('postgresql://postgres:123@localhost:5432/fitquest', echo=True)
if not database_exists(engine.url):
    # não funciona com a versão atual do python (3.12) :(
    create_database(engine.url)
