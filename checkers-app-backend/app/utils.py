from typing import Callable, List, Tuple
from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, HTTPException
from app import database
# Dependency

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

#helper functions       
# def board_state_func(player1_id: int, player2_id: int, db: Session = Depends(get_db)):
def board_state_func():
    board = []
    for row in range(8):
        board.append([])
        for col in range(8):
            if (row + col) % 2 == 0:
                board[row].append("")
            else:
                if row < 3:
                    board[row].append("w")
                elif row > 4:
                    board[row].append("b")
                else:
                    board[row].append("")
    return board

def get_adjacent_cells(row: int, col: int) -> List[Tuple[int, int]]:
    board_state = board_state_func()

    empty_cells = []
    directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]]  # Diagonal directions
    
    for dx, dy in directions:
        new_row, new_col = int(row) + dx, int(col) + dy

        if is_valid_cell(new_row, new_col) and board_state[new_row][new_col] == "":
            empty_cells.append((new_row, new_col))
    return empty_cells

def is_valid_cell(row: int, col: int) -> bool:
    return 0 <= row < 8 and 0 <= col < 8

def is_valid_move(color_id: int, from_position: Tuple[int, int], to_position: Tuple[int, int]) -> bool:
    row, col = from_position
    new_row, new_col = to_position
    # piece = board_state_func()
    if (new_row + new_col) % 2 == 0:
        return False
    if color_id == 2 and new_row > row:
        return False
    if color_id == 1 and new_row < row:
        return False
    return True

