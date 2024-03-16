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


    # piece_id = 1
    # for i, row in enumerate(board):
    #     for j, cell in enumerate(row):
    #         if cell == 'B':
    #             piece = models.Piece(id=piece_id, name=f'{cell}{piece_id}', starting_position=str([i, j]), player_id=player1.id)
    #             db.add(piece)
    #             piece_id += 1
    #         elif cell == 'W':
    #             piece = models.Piece(id=piece_id, name=f'{cell}{piece_id}', starting_position=str([i, j]), player_id=player2.id)
    #             db.add(piece)
    #             piece_id += 1

    # db.commit()