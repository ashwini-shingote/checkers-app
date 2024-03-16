import json
from . import models, schemas
from app import database

db = database.SessionLocal()

def initialize_board():
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

    piece_id = 1
    for i, row in enumerate(board):
        for j, cell in enumerate(row):
            if cell in ['B', 'W']:
                piece = models.Piece(id=piece_id, name=f'{cell}{piece_id}', starting_position=[i, j])
                db.add(piece)
                piece_id += 1

    db.commit()

    return board

