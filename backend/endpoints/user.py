from fastapi import APIRouter, Body, Response, status, HTTPException
from typing import Annotated
from db.db import Session
from sqlalchemy import select, or_, case, and_
from datetime import date
from .exercicio import get_streaks_geral
from classes.amizade import Amizade
from classes.user import User
from classes.status import Status, statuses

router = APIRouter(
    tags=["user"],
    responses={404: {"description": "Not found"}}
)

@router.post("/add-amigo/{user_id}")
def add_amigo(user_id: int, res: Response, amigoId: int = Body(..., embed=True)):
    with Session() as sess:
        stmt = select(User).where(User.id == amigoId)
        amigo = sess.execute(stmt).first()
        if (amigo is None):
            res.status_code = status.HTTP_400_BAD_REQUEST
            raise HTTPException(status_code=400, detail=f"Usuário com id {amigoId} não encontrado.")
        amigo = amigo[0]

        stmt = select(User).where(User.id == user_id)
        user = sess.execute(stmt).first()
        if (user is None):
            res.status_code = status.HTTP_400_BAD_REQUEST
            raise HTTPException(status_code=400, detail=f"Usuário com id {user_id} não encontrado.")
        
        user = user[0]
        friendship_exists = sess.query(Amizade).filter(
            ((Amizade.user1_id == user.id) & (Amizade.user2_id == amigo.id)) |
            ((Amizade.user1_id == amigo.id) & (Amizade.user2_id == user.id))
        ).first()
        if friendship_exists:
            res.status_code = status.HTTP_400_BAD_REQUEST
            raise HTTPException(status_code=400, detail="A amizade já existe.")
        
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
    
@router.get("/get-amigos/{user_id}/{filtro}")
def get_amigos(user_id, filtro):
    filtro_string = f"%%{filtro}%%"

    with Session() as sess:
        cte = select(Status.id).where(Status.descricao == statuses[0]).cte("status_ativo") 

        stmt = select(User.id, User.username, User.fullname).where(User.id.in_(
            select(
                case(
                    (Amizade.user1_id == user_id, 
                     Amizade.user2_id), 
                    else_=Amizade.user1_id
                )
            )
            .join(cte, cte.c.id == Amizade.status_id)
            .where(
                and_(
                    or_(Amizade.user1_id == user_id, Amizade.user2_id == user_id), 
                    or_(User.username.ilike(filtro_string), User.fullname.ilike(filtro_string))
                    )
                )
            )
        )
        
        amigos = [{"id": r[0], "username": r[1], "fullname": r[2]} for r in sess.execute(stmt).all()]
        return amigos
    
@router.get("/get-nao-amigos/{user_id}/{filtro}")
def get_amigos(user_id, filtro):
    filtro_string = f"%%{filtro}%%"

    with Session() as sess:
        cte = select(Status.id).where(Status.descricao == statuses[0]).cte("status_ativo") 

        stmt = select(User.id, User.username, User.fullname).where(
            and_(
                User.id.not_in(
                    select(
                        case(
                            (Amizade.user1_id == user_id, Amizade.user2_id), 
                            else_=Amizade.user1_id
                        )
                    )
                    .join(cte, cte.c.id == Amizade.status_id)
                    .where(or_(Amizade.user1_id == user_id, Amizade.user2_id == user_id))
                ),
                User.id != user_id,
                or_(User.username.ilike(filtro_string), User.fullname.ilike(filtro_string)),
            )
        )
        
        amigos = sess.execute(stmt).mappings().all()
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
    
@router.get("/informacoes/{user_id}")
def get_informacoes_usuario(user_id:int):
    with Session() as sess:
        infos = sess.execute(select(User.id, User.altura, User.peso).where(User.id == user_id)).mappings().first()
        if not infos:
            raise HTTPException(status_code=400, detail="Usuário não encontrado.")

        streaks = get_streaks_geral(user_id)
        res = dict()
        res.update(infos)
        res.update(streaks)
        return res
    
@router.put("/status-pedido-amizade/{user_id}")
def change_status_pedido_amizade(user_id: int, id: Annotated[int, Body()], status: Annotated[int, Body()], res: Response):
    with Session() as sess:

        stmt = select(Amizade).where(and_(Amizade.user1_id == id, Amizade.user2_id == user_id))
        amizade = sess.scalar(stmt)
        amizade.status_id = status
        try:
            sess.commit()
        except Exception as err:
            return err

        return f"Status da amizade alterado com sucesso para {status}"

@router.delete("/delete-pedido-amizade/{user_id}/{id}")
def delete_pedido_amizade(user_id: int, id: int):
    with Session() as sess:
        stmt = select(Amizade).where(Amizade.user1_id == id, Amizade.user2_id == user_id)

        amizade = sess.scalar(stmt)
        sess.delete(amizade)
        try:
            sess.commit()
        except Exception as err:
            return err

        return f"Pedido de amizade deletado com sucesso"
    
@router.delete("/delete-amizade/{user_id}/{id}")
def delete_amizade(user_id: int, id: int):
    with Session() as sess:
        stmt = select(Amizade).where(
            or_(
                and_(Amizade.user1_id == user_id, Amizade.user2_id == id),
                and_(Amizade.user1_id == id, Amizade.user2_id == user_id)
            )
        )
        amizade = sess.scalar(stmt)
        sess.delete(amizade)
        try:
            sess.commit()
        except Exception as err:
            return err

        return f"Amizade deletada com sucesso"
    
@router.patch("/{user_id}/peso")
def editar_peso(user_id:int, valor: float = Body(..., embed=True)):
    with Session() as sess:
        user = sess.scalar(select(User).where(User.id == user_id))
        if not user:
            raise HTTPException(status_code=400, detail=f"Usuário com id {user_id} não encontrado")
        
        user.peso = valor
        sess.commit()
        return "Valor atualizado com sucesso"
    
@router.patch("/{user_id}/altura")
def editar_altura(user_id:int, valor: float = Body(..., embed=True)):
    with Session() as sess:
        user = sess.scalar(select(User).where(User.id == user_id))
        if not user:
            raise HTTPException(status_code=400, detail=f"Usuário com id {user_id} não encontrado")
        
        user.altura = valor
        sess.commit()
        return "Valor atualizado com sucesso"