from datetime import datetime, timezone
from fastapi import HTTPException
from sqlalchemy.orm import Session
from . import models, schemas


def move_piece_from_to(session, piece_id, from_position, to_position):
    # Query for the piece
    piece = session.query(models.Piece).filter(models.Piece.id == piece_id).first()

    # Check if the piece is at the expected position
    if piece.position != from_position:
        raise ValueError(f"Piece is not at position {from_position}")

    # Update the piece's position
    piece.position = to_position

    # Commit the changes to the database
    session.commit()

