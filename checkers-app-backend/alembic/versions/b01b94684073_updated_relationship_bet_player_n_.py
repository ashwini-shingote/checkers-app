"""updated relationship bet player n pieces table

Revision ID: b01b94684073
Revises: d5f38071456e
Create Date: 2024-03-16 00:27:56.382757

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b01b94684073'
down_revision: Union[str, None] = 'd5f38071456e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('pieces', sa.Column('player_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'pieces', 'players', ['player_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'pieces', type_='foreignkey')
    op.drop_column('pieces', 'player_id')
    # ### end Alembic commands ###