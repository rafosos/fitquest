from fastapi import APIRouter, Body, Response, status
from typing import Annotated
from db.db import Session
from sqlalchemy import select, or_, case, and_
from datetime import date

from classes.amizade import Amizade
from classes.user import User
from classes.status import Status, statuses

router = APIRouter(
    tags=["user"],
    responses={404: {"description": "Not found"}}
)

@router.post("/add-amigo/{user_id}")
def add_amigo(user_id: int, res: Response, nickname: str = Body(..., embed=True)):
    with Session() as sess:
        stmt = select(User).where(User.nickname == nickname)
        amigo = sess.execute(stmt).first()
        if (amigo is None):
            res.status_code = status.HTTP_400_BAD_REQUEST
            return f"Usuário {nickname} não encontrado."
        amigo = amigo[0]

        stmt = select(User).where(User.id == user_id)
        user = sess.execute(stmt).first()
        if (user is None):
            res.status_code = status.HTTP_400_BAD_REQUEST
            return f"Usuário com id {user_id} não encontrado."
        
        user = user[0]
        friendship_exists = sess.query(Amizade).filter(
            ((Amizade.user1_id == user.id) & (Amizade.user2_id == amigo.id)) |
            ((Amizade.user1_id == amigo.id) & (Amizade.user2_id == user.id))
        ).first()
        if friendship_exists:
            res.status_code = status.HTTP_400_BAD_REQUEST
            return "A amizade já existe."
        amizade = Amizade(status_id=2, data=date.today())
        amizade.user2 = amigo
        user.amizades_sent.append(amizade)
        sess.commit()

        res.status_code = status.HTTP_200_OK
        return "O pedido de amizade foi enviado com sucesso"

@router.get("/get-amigos/{user_id}")
def get_amigos(user_id):
    with Session() as sess:

        cte = select(Status.id).where(Status.descricao == statuses[0]).cte("status_ativo") 

        stmt = select(User).where(User.id.in_(
            select(
                case(
                    (Amizade.user1_id == user_id, 
                     Amizade.user2_id), 
                    else_=Amizade.user1_id
                )
            )
            .join(cte, cte.c.id == Amizade.status_id)
            .where(or_(Amizade.user1_id == user_id, Amizade.user2_id == user_id)))
        )
        
        amigos = sess.scalars(stmt).all()
        return amigos
    
@router.get("/get-pedidos-amizade/{user_id}")
def get_pedidos_amizade(user_id: int):
    with Session() as sess:

        stmt = select(User)\
            .join(Amizade, Amizade.user1_id == User.id)\
            .join(Status, Amizade.status_id == Status.id)\
            .where(and_(Amizade.user2_id == user_id, Status.descricao == statuses[1]))
        
        amigos = sess.scalars(stmt).all()
        return amigos
    
@router.put("/status-pedido-amizade/{user_id}")
def get_pedidos_amizade(user_id: int, id: Annotated[int, Body()], status: Annotated[int, Body()], res: Response):
    with Session() as sess:

        stmt = select(Amizade).where(and_(Amizade.user1_id == id, Amizade.user2_id == user_id))
        amizade = sess.scalar(stmt)
        amizade.status_id = status
        try:
            sess.commit()
        except Exception as err:
            return err

        return f"Status da amizade alterado com sucesso para {status}"