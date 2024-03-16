
from sqlalchemy.orm import Session
from . import models, schemas

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
    db.query(models.Piece).delete()
    db.commit()
    piece_id = 1
    for i, row in enumerate(board):
        for j, cell in enumerate(row):
            if cell == 'B':
                # piece = models.Piece(id=piece_id, name=f'{cell}{piece_id}', starting_position=str([i, j]), player_id=player)
                piece = models.Piece(id=piece_id, name=f'{cell}{piece_id}', starting_position=str([i, j]), player_id=player1_id)
                db.add(piece)
                piece_id += 1
            elif cell == 'W':
                # piece = models.Piece(id=piece_id, name=f'{cell}{piece_id}', starting_position=str([i, j]), player_id=player2.id)
                piece = models.Piece(id=piece_id, name=f'{cell}{piece_id}', starting_position=str([i, j]), player_id=player2_id)
                db.add(piece)
                piece_id += 1

    db.commit()
    return board