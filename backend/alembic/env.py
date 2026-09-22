from alembic import context

from app.core.config import settings
from app.db.base import Base


target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(url=settings.database_url, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    run_migrations_offline()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
