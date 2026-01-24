"""Add role field to user_profiles

Revision ID: 278fb1cbca1c
Revises: 
Create Date: 2025-10-02 11:33:55.120216

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '278fb1cbca1c'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # 1. Add column as nullable
    op.add_column('user_profiles', sa.Column('role', sa.String(length=10), nullable=True))
    # 2. Fill all existing rows with default value
    op.execute("UPDATE user_profiles SET role='user' WHERE role IS NULL;")
    # 3. Set NOT NULL constraint
    op.alter_column('user_profiles', 'role', nullable=False)

def downgrade():
    op.drop_column('user_profiles', 'role')
