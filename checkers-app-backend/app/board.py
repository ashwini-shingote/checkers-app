from sqlalchemy import ForeignKeyConstraint
from sqlalchemy.orm import Session
from . import models, schemas

move_type_regular = "regular"
move_type_captured = "captured"

def initialize_board(player1_id: int, player2_id: int, db: Session):

    board = [
        ['_', 'B', '_', 'B', '_', 'B', '_', 'B'],
        ['B', '_', 'B', '_', 'B', '_', 'B', '_'],
        ['_', 'B', '_', 'B', '_', 'B', '_', 'B'],
        ['_', '_', '_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_', '_', '_'],
        ['W', '_', 'W', '_', 'W', '_', 'W', '_'],
        ['_', 'W', '_', 'W', '_', 'W', '_', 'W'],
        ['W', '_', 'W', '_', 'W', '_', 'W', '_']
    ]

    # Create pieces and associate them with players
    # db.query(models.Piece).delete()
    # Delete referencing records from the 'moves' table
    db.query(models.Move).filter(models.Move.piece_id.in_(db.query(models.Piece.id))).delete(synchronize_session=False)

    # Delete records from the 'pieces' table
    db.query(models.Piece).delete()
    db.commit()
    piece_id = 1
    for i, row in enumerate(board):
        for j, cell in enumerate(row):
            if cell == 'B':
                # piece = models.Piece(id=piece_id, name=f'{cell}{piece_id}', starting_position=str([i, j]), player_id=player)
                piece = models.Piece(id=piece_id, name=f'{cell}{piece_id}', position='{' + ','.join([str(i), str(j)]) + '}', player_id=player1_id)
                db.add(piece)
                piece_id += 1
            elif cell == 'W':
                # piece = models.Piece(id=piece_id, name=f'{cell}{piece_id}', starting_position=str([i, j]), player_id=player2.id)
                piece = models.Piece(id=piece_id, name=f'{cell}{piece_id}', position='{' + ','.join([str(i), str(j)]) + '}', player_id=player2_id)
                db.add(piece)
                piece_id += 1

    db.commit()

    # Delete move_types records
    db.query(models.MoveType).delete()
    db.commit()

    # Create move types
    db.add(models.MoveType(name=move_type_regular))
    db.add(models.MoveType(name=move_type_captured))
    db.commit()

    return board