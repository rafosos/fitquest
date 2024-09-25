from sqlalchemy import create_engine, select
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.orm import DeclarativeBase, sessionmaker


engine = create_engine('postgresql://postgres:123@localhost:5432/fitquest', echo=True)
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
            return sess.execute(select(self)).first()
    
    def select_all(self):    
        with Session() as sess:
            return sess.execute(select(self)).fetchall()