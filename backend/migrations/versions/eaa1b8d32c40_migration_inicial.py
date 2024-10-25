"""migration inicial

Revision ID: eaa1b8d32c40
Revises: 
Create Date: 2024-10-25 17:48:36.332853

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'eaa1b8d32c40'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('campeonato',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nome', sa.String(), nullable=False),
    sa.Column('duracao', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('classe',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nome', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('grupo_muscular',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nome', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('item',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nome', sa.String(), nullable=False),
    sa.Column('descricao', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('skill',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nome', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('status',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('descricao', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nickname', sa.String(length=20), nullable=False),
    sa.Column('fullname', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('level', sa.Integer(), nullable=False),
    sa.Column('admin', sa.Boolean(), nullable=False),
    sa.Column('senha', sa.String(), nullable=False),
    sa.Column('nascimento', sa.Date(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('nickname')
    )
    op.create_table('amizade',
    sa.Column('user1_id', sa.Integer(), nullable=False),
    sa.Column('user2_id', sa.Integer(), nullable=False),
    sa.Column('data', sa.Date(), server_default=sa.text('now()'), nullable=False),
    sa.Column('status_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['status_id'], ['status.id'], ),
    sa.ForeignKeyConstraint(['user1_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['user2_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('user1_id', 'user2_id')
    )
    op.create_table('exercicio',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nome', sa.String(), nullable=False),
    sa.Column('grupo_muscular_id', sa.Integer(), nullable=True),
    sa.Column('criado_por', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['criado_por'], ['user.id'], ),
    sa.ForeignKeyConstraint(['grupo_muscular_id'], ['grupo_muscular.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('rotina',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nome', sa.String(), nullable=False),
    sa.Column('dias', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_campeonato',
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('campeonato_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['campeonato_id'], ['campeonato.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], )
    )
    op.create_table('user_skill',
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('skill_id', sa.Integer(), nullable=True),
    sa.Column('value', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['skill_id'], ['skill.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], )
    )
    op.create_table('exercicio_campeonato',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('exercicio_id', sa.Integer(), nullable=False),
    sa.Column('campeonato_id', sa.Integer(), nullable=False),
    sa.Column('data', sa.Date(), server_default=sa.text('now()'), nullable=False),
    sa.Column('qtd_serie', sa.Integer(), nullable=False),
    sa.Column('qtd_repeticoes', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['campeonato_id'], ['campeonato.id'], ),
    sa.ForeignKeyConstraint(['exercicio_id'], ['exercicio.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('exercicio_rotina',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('exercicio_id', sa.Integer(), nullable=False),
    sa.Column('rotina_id', sa.Integer(), nullable=False),
    sa.Column('qtd_serie', sa.Integer(), nullable=True),
    sa.Column('qtd_repeticoes', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['exercicio_id'], ['exercicio.id'], ),
    sa.ForeignKeyConstraint(['rotina_id'], ['rotina.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('treino',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('rotina_id', sa.Integer(), nullable=True),
    sa.Column('campeonato_id', sa.Integer(), nullable=True),
    sa.Column('data', sa.Date(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['campeonato_id'], ['campeonato.id'], ),
    sa.ForeignKeyConstraint(['rotina_id'], ['rotina.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_exercicio',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('treino_id', sa.Integer(), nullable=False),
    sa.Column('exec_rotina_id', sa.Integer(), nullable=True),
    sa.Column('exec_campeonato_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['exec_campeonato_id'], ['exercicio_campeonato.id'], ),
    sa.ForeignKeyConstraint(['exec_rotina_id'], ['exercicio_rotina.id'], ),
    sa.ForeignKeyConstraint(['treino_id'], ['treino.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_exercicio')
    op.drop_table('treino')
    op.drop_table('exercicio_rotina')
    op.drop_table('exercicio_campeonato')
    op.drop_table('user_skill')
    op.drop_table('user_campeonato')
    op.drop_table('rotina')
    op.drop_table('exercicio')
    op.drop_table('amizade')
    op.drop_table('user')
    op.drop_table('status')
    op.drop_table('skill')
    op.drop_table('item')
    op.drop_table('grupo_muscular')
    op.drop_table('classe')
    op.drop_table('campeonato')
    # ### end Alembic commands ###
