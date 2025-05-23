from fastapi import APIRouter, Body, Response, status, HTTPException, Depends
from typing import Annotated
from db.db import Session
from sqlalchemy import select, or_, case, and_
from datetime import date
from .exercicio import get_streaks_geral
from models.amizade import Amizade
from models.user import User
from models.status import Status
from assets.dump_db import statuses
from .login import get_current_user
import logging
logger = logging.getLogger("api")

router = APIRouter(
    dependencies=[Depends(get_current_user)],
    tags=["user"],
    prefix='/user',
)

@router.post("/add-amigo/{amigo_id}")
def add_amigo(amigo_id: int, current_user: Annotated[User, Depends(get_current_user)], res: Response):
    user_id = current_user.id
    with Session() as sess:
        stmt = select(User).where(User.id == amigo_id)
        amigo = sess.execute(stmt).first()
        if (amigo is None):
            res.status_code = status.HTTP_400_BAD_REQUEST
            raise HTTPException(status_code=400, detail=f"Usuário com id {amigo_id} não encontrado.")
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

@router.get("/get-amigos")
def get_amigos(current_user: Annotated[User, Depends(get_current_user)]):
    user_id = current_user.id
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
    
@router.get("/get-amigos/{filtro}")
def get_amigos(current_user: Annotated[User, Depends(get_current_user)], filtro):
    user_id = current_user.id
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
    
@router.get("/get-nao-amigos/{filtro}")
def get_amigos(current_user: Annotated[User, Depends(get_current_user)], filtro):
    user_id = current_user.id
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
    
@router.get("/get-pedidos-amizade/")
def get_pedidos_amizade(current_user: Annotated[User, Depends(get_current_user)]):
    user_id = current_user.id
    with Session() as sess:

        stmt = select(User.id, User.username, User.fullname, Amizade.status_id)\
            .join(Amizade, Amizade.user1_id == User.id)\
            .join(Status, Amizade.status_id == Status.id)\
            .where(and_(Amizade.user2_id == user_id, Status.descricao == statuses[1]))
        
        amigos = sess.execute(stmt).mappings().all()
        return amigos
    
@router.get("/informacoes/")
def get_informacoes_usuario(current_user: Annotated[User, Depends(get_current_user)]):
    user_id = current_user.id
    with Session() as sess:
        infos = sess.execute(
            select(
                User.id, 
                User.altura, 
                User.peso,
                User.status
            ).where(User.id == user_id)).mappings().first()
        if not infos:
            raise HTTPException(status_code=400, detail="Usuário não encontrado.")

        streaks = get_streaks_geral(current_user)
        res = dict()
        res.update(infos)
        res.update(streaks)
        return res
    
@router.put("/status-pedido-amizade/")
def change_status_pedido_amizade(
    current_user: Annotated[User, Depends(get_current_user)], 
    id: Annotated[int, Body()], 
    status: Annotated[int, Body()]):

    with Session() as sess:

        stmt = select(Amizade).where(and_(Amizade.user1_id == id, Amizade.user2_id == current_user.id))
        amizade = sess.scalar(stmt)
        if(not amizade):
            raise HTTPException(404, "Amizade não encontrada")
        
        amizade.status_id = status
        try:
            sess.commit()
        except Exception as err:
            return err

        return f"Status da amizade alterado com sucesso para {status}"

@router.delete("/delete-pedido-amizade/{id}")
def delete_pedido_amizade(current_user: Annotated[User, Depends(get_current_user)], id: int):
    user_id = current_user.id
    with Session() as sess:
        stmt = select(Amizade).where(Amizade.user1_id == id, Amizade.user2_id == user_id)

        amizade = sess.scalar(stmt)
        sess.delete(amizade)
        try:
            sess.commit()
        except Exception as err:
            return err

        return f"Pedido de amizade deletado com sucesso"
    
@router.delete("/delete-amizade/{id}")
def delete_amizade(current_user: Annotated[User, Depends(get_current_user)], id: int):
    user_id = current_user.id
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
        
@router.patch("/editar/{campo}")
def editar_altura(current_user: Annotated[User, Depends(get_current_user)], campo: str, valor: str = Body(..., embed=True)):
    user_id = current_user.id
    with Session() as sess:
        user = sess.scalar(select(User).where(User.id == user_id))
        if not user:
            raise HTTPException(status_code=400, detail=f"Usuário com id {user_id} não encontrado")
        
        setattr(user, campo, valor)
        sess.commit()
        return user
    
@router.get("/perfil-configuracoes/")
def get_perfil_configs(current_user: Annotated[User, Depends(get_current_user)]):
    with Session() as sess:
        user = sess.execute(select(
            User.fullname,
            User.nascimento,
            User.peso,
            User.altura,
            User.email,
            User.status
        ).where(User.id == current_user.id)).mappings().first()

        if not user:
            raise HTTPException(status_code=400, detail="Usuário não encontrado")

        return user
    
@router.get("/perfil/{amigo_id}")
def get_user_perfil(current_user: Annotated[User, Depends(get_current_user)], amigo_id: int):
    user_id = current_user.id
    with Session() as sess:
        user = sess.execute(select(
            User.fullname,
            User.username,
            User.peso,
            User.altura,
            User.status,
            Amizade.status_id.label("status_amizade"),
            case((Amizade.user1_id == user_id, True), else_=False).label("autor_pedido")
        )
        .join(Amizade, 
                or_(
                    and_(User.id == Amizade.user1_id, Amizade.user2_id == user_id), 
                    and_(User.id == Amizade.user2_id, Amizade.user1_id == user_id) 
                ),
                isouter=True
            )
        .where(User.id == amigo_id)).mappings().first()

        if not user:
            raise HTTPException(status_code=400, detail="Usuário não encontrado")

        streaks = {}
        try:
            streaks = get_streaks_geral(amigo_id)
        except:
            print("deu ruim nos streaks")

        return {**user, **streaks}