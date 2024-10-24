from sqlalchemy import create_engine, select
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_NAME = os.getenv('DATABASE_NAME')
DATABASE_PORT = os.getenv('DATABASE_PORT')
DATABASE_USERNAME = os.getenv("DATABASE_USERNAME")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
DATABASE_HOST = os.getenv("DATABASE_HOST")

engine = create_engine(f'postgresql://{DATABASE_USERNAME}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}', echo=True)
Session = sessionmaker(engine, expire_on_commit=False)
if not database_exists(engine.url):
    # não funciona com a versão atual do python (3.12) :(
    create_database(engine.url)


class Base(DeclarativeBase):
    def add(self, new_values):
        with Session() as sess:
            sess.add(new_values)
            sess.commit()

    def add_self(self):
        with Session() as sess:
            sess.add(self)
            sess.commit()

    def add_all(new_values):
        with Session() as sess:
            sess.add_all(new_values)
            sess.commit()

    def delete(self):
        with Session() as sess:
            sess.delete(self)
            sess.commit()

    def save(self):
        with Session() as sess:
            sess.commit()

    def select_one(self):
        with Session() as sess:
            res = sess.execute(select(self)).first()
            if (not res):
                return None
            return res[0]
    
    def select_all(self):    
        with Session() as sess:
            return sess.execute(select(self))
    
    def select_all(self, sess):    
        return sess.execute(select(self))