from datetime import datetime, timezone
from fastapi import HTTPException
from sqlalchemy.orm import Session
from . import models, schemas


def create_new_player(db: Session, player: schemas.PlayerCreate):
    db_player = models.Player(
        # id=player.id,
        player_name=player.player_name,
        updated_at=datetime.now(timezone.utc)
        )
    db.add(db_player)

    db.commit()
    db.refresh(db_player)
    return db_player