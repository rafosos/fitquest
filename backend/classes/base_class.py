from db.db import Session
from sqlalchemy import select
from sqlalchemy.orm import DeclarativeBase

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