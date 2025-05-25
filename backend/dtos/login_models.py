from pydantic import BaseModel
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str
    id: str

class CadastroModel(BaseModel):
    username: str 
    fullname: str
    email: str
    nascimento: datetime 
    senha: str
    