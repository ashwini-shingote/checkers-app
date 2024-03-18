from typing import Callable, List, Tuple
from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, HTTPException
from app import database, models, schemas
# Dependency

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# #helper functions       
# # def board_state_func(player1_id: int, player2_id: int, db: Session = Depends(get_db)):
# def board_state_func():
#     board = []
#     for row in range(8):
#         board.append([])
#         for col in range(8):
#             if (row + col) % 2 == 0:
#                 board[row].append("")
#             else:
#                 if row < 3:
#                     board[row].append("w")
#                 elif row > 4:
#                     board[row].append("b")
#                 else:
#                     board[row].append("")
#     return board

def get_adjacent_cells(row: int, col: int, db: Session = Depends(get_db)) -> List[Tuple[int, int]]:
    board_state = board_state_func()

    empty_cells = []
    directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]]  # Diagonal directions
    
    for dx, dy in directions:
        new_row, new_col = int(row) + dx, int(col) + dy
        
        if is_valid_cell(new_row, new_col) and is_cell_empty(new_row, new_col, db) == True:
            empty_cells.append((new_row, new_col))
    
    return empty_cells

def is_valid_cell(row: int, col: int) -> bool:
    return 0 <= row < 8 and 0 <= col < 8

def is_valid_move_direction(
                color_id: int, 
                from_position: Tuple[int, int], 
                to_position: Tuple[int, int]) -> bool:
    row, col = from_position
    new_row, new_col = to_position
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


#Basic function to end the game, we could update it later if we need to
def end_game(game_id: int, db: Session):
    game = db.query(models.Game).filter(models.Game.id == game_id).first()
    if game:
        game.is_finished = True

        db.commit()


def promote_to_king(
    piece_id: int, 
    to_position: str,
    player_id: int, 
    game_id: int, 
    db: Session
) -> bool:

    new_row = int(to_position.strip('{}').split(',')[0])

    player = db.query(models.Player).filter(models.Player.id == player_id).first()
    
    if player and ((player.color_id == 1 and new_row == 7) or (player.color_id == 2 and new_row == 0)):
        #I have called the move type promotion, if you had anything else in mind we can change it later
        promotion_move_type = db.query(models.MoveType).filter(models.MoveType.name == "promotion").first()

        last_move_order = db.query(models.Move).filter(models.Move.game_id == game_id).order_by(models.Move.move_order.desc()).first()
        next_move_order = last_move_order.move_order + 1 if last_move_order else 1 

        new_king_move = models.Move(
            piece_id=piece_id,
            game_id=game_id,
            player_id=player_id,
            move_type_id=promotion_move_type.id, #promotion name could change
            move_order=next_move_order,
            from_position=to_position,
            to_position=to_position,
            piece_taken='',
            is_king=True
        )
        db.add(new_king_move)

        end_game(game_id, player_id, db)
        db.commit()
        return True

    return False