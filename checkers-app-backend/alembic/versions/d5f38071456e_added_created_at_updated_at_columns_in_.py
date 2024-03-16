"""added created_at, updated_at columns  in players

Revision ID: d5f38071456e
Revises: 1fa9e9e6f592
Create Date: 2024-03-15 22:09:24.277447

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd5f38071456e'
down_revision: Union[str, None] = '1fa9e9e6f592'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('players', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False))
    op.add_column('players', sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('players', 'updated_at')
    op.drop_column('players', 'created_at')
    # ### end Alembic commands ###
