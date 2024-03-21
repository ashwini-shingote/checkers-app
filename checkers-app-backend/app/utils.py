from typing import Callable, List, Tuple
from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, HTTPException
from app import database, models, schemas, utils

move_type_regular = "regular"
move_type_captured = "captured"


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_adjacent_cells(from_position: str, to_position:str, player_id:int, db: Session = Depends(get_db)) -> List[Tuple[int, int]]:

    row, col = map(int, from_position.strip('{}').split(','))

    empty_cells = []

    directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]]  # Diagonal crawls
    for dx, dy in directions:
        new_row, new_col = int(row) + dx, int(col) + dy
        
        if is_valid_cell(new_row, new_col) and is_cell_empty(new_row, new_col, db) == True:
            empty_cells.append((new_row, new_col))
    
    directions = [[-2, -2], [-2, 2], [2, -2], [2, 2]]  # Diagonal jumps
    for dx, dy in directions:
        new_row, new_col = int(row) + dx, int(col) + dy
        
        if is_valid_cell(new_row, new_col) and is_cell_empty(new_row, new_col, db) == True and is_valid_jump(row, col, new_row, new_col, player_id, db) == True:
            empty_cells.append((new_row, new_col))

    return empty_cells


def is_valid_cell(row: int, col: int) -> bool:
    return 0 <= row < 8 and 0 <= col < 8


def is_valid_move_direction(
                color_id: int,
                row: int,
                new_row: int,
                new_col: int) -> bool:

    if (new_row + new_col) % 2 == 0:
        return False
    if color_id == 2 and new_row > row:
        return False
    if color_id == 1 and new_row < row:
        return False
    return True


def is_cell_empty(row: int, col: int, db: Session = Depends(get_db)) -> bool:
    to_position ='{' + ','.join([str(row), str(col)]) + '}'
    piece_at_position = db.query(models.Piece).filter(models.Piece.position == to_position, models.Piece.is_out == False).first()
    if piece_at_position is None:
        return True
    return False


def is_same_color(to_position: str, player_color_id: int, db: Session = Depends(get_db)) -> bool:
    piece_at_position = db.query(models.Piece).filter(models.Piece.position == to_position, models.Piece.is_out == False).first()
    if piece_at_position.id < 13:
        piece_color_id = 1
    else:
        piece_color_id = 2

    if piece_color_id == player_color_id:
        return True
    return False


#Basic function to end the game
def end_game(game_id: int, db: Session):
    game = db.query(models.Game).filter(models.Game.id == game_id).first()
    if game:
        game.is_finished = True

        db.commit()


def is_valid_position_format(pos_str: str) -> bool:
    if not pos_str.startswith("{") or not pos_str.endswith("}"):
        return False
    try:
        x, y = map(int, pos_str.strip("{}").split(","))
        return True
    except ValueError:
        return False
    
    
def promoted_to_king(
    piece_id: int, 
    new_row: int,
    player_id: int, 
    db: Session
) -> bool:

    player = db.query(models.Player).filter(models.Player.id == player_id).first()
    
    if player:

        if (player.color_id == 1 and new_row == 7) or (player.color_id == 2 and new_row == 0):

            piece = db.query(models.Piece).filter(models.Piece.id == piece_id).first()
            if piece:
                return True

    return False


def is_valid_jump(
    from_row: int,
    from_col: int,
    to_row: int,
    to_col: int, 
    player_id: int,
    db: Session
) -> bool:
    
    jumped_row, jumped_col = (from_row + to_row) // 2, (from_col + to_col) // 2
    jumped_position = f'{{{jumped_row},{jumped_col}}}'

    jumped_piece = db.query(models.Piece).filter(
        models.Piece.position == jumped_position,
        models.Piece.player_id != player_id, 
        models.Piece.is_out == False
    ).first()
    
    if jumped_piece:
        return True
    
    return False


def captured_piece(
    from_row: int, 
    from_col: int, 
    to_row: int, 
    to_col: int, 
    player_id: int,
    db: Session
) -> int:
    
    jumped_row, jumped_col = (from_row + to_row) // 2, (from_col + to_col) // 2
    jumped_position = f'{{{jumped_row},{jumped_col}}}'

    jumped_piece = db.query(models.Piece).filter(
        models.Piece.position == jumped_position,
        models.Piece.player_id != player_id, 
        models.Piece.is_out == False
    ).first()
    
    if jumped_piece:
        jumped_piece.is_out = True
        db.commit()
        return jumped_piece.id 

    return 0
