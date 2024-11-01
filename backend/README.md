Instruções de como criar um ambiente virtual (virtual environment) utilizando venv em python (inglês): https://fastapi.tiangolo.com/virtual-environments/

Rodar:
fastapi dev main.py

ou

python main.py


Gerar migration:

alembic revision --autogenerate -m "name"


Rodar migration na mão:

alembic upgrade head