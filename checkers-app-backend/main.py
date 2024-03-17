from fastapi import Depends, FastAPI, HTTPException
from typing import Union
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import ValidationError
from ast import literal_eval
from datetime import datetime, timezone
from app import database, models
from app.schemas import (
        ErrorResponse,
        PlayerBase,
        PlayerCreate,
        GameBase,
        Games,
        GameInitialize,
        MoveBase,
        MovesUpdate,
        PieceBase,
        Healthz
)
from app.moves import move_piece_from_to
from app.utils import (
        get_adjacent_cells, 
        is_valid_cell, 
        is_valid_move_direction, 
        board_state_func
)
from app.board import initialize_board

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Dependency

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Methods
# Health check
@app.get("/")
def read_root() -> dict[str, str]:
    return {"Hello": "World"}

#create new player as player 
@app.post("/player", response_model=GameBase)
def create_player(
                player1: PlayerCreate, 
                player2: PlayerCreate, 
                db: Session = Depends(get_db)):
    player1 = models.Player(
                player_name=player1.player_name, 
                color_id=1, 
                updated_at=datetime.now(timezone.utc)
                        )
    player2 = models.Player(
                player_name=player2.player_name, 
                color_id=2,
                updated_at=datetime.now(timezone.utc)
                        )
    
    db.add(player1)
    db.add(player2)
    db.commit()
    db.refresh(player1)
    db.refresh(player2)

    game = models.Game(
                player1_id=player1.id, 
                player2_id=player2.id)
    db.add(game)
    db.commit()
    db.refresh(game)
    return game

# create board with players id received
@app.get("/create-board/{player1_id}/{player2_id}", response_model=GameInitialize)
def create_board(
                player1_id: int, 
                player2_id: int, 
                db: Session = Depends(get_db)
                ):
    initial_board = initialize_board(player1_id=player1_id, player2_id=player2_id, db=db)
    # return {"board": initial_board}
    return {"board": initial_board, "player1_id": player1_id, "player2_id": player2_id}

# move piece
@app.get(
                "/move-piece/{game_id}/{player_id}/{piece_id}/{from_position}/{to_position}", 
                response_model=Union[MovesUpdate, PieceBase, ErrorResponse]
        )
def move_piece(
                piece_id: int, 
                from_position: str, 
                to_position: str, 
                player_id: int, 
                game_id: int, 
                db: Session = Depends(get_db)
            ):
    
    # return move_piece_from_to(db, piece_id, from_position, to_position)
    from_position = str(from_position).replace(" ", "")  
    to_position = str(to_position).replace(" ", "")
    # Query for the piece
    piece = db.query(models.Piece).filter(models.Piece.id == piece_id).first()

    # Check if the piece is at the expected position
    if piece.position != str(from_position) or piece.position == "":
        # raise ValueError(f"Piece is not at position {from_position}")
        return ErrorResponse(error="Piece is not at given start position ")
    
    # Get empty adjacent cells
    adjacent_cells = get_adjacent_cells(
                        int(from_position[1]), 
                        int(from_position[3])
                        )
    
    # Check if the move is valid
    if not is_valid_cell(int(to_position[1]), int(to_position[3])):
        # raise ValueError(f"Invalid move to position {to_position}")
        return ErrorResponse(error="Invalid move")
    
    if (int(to_position[1]), int(to_position[3])) not in adjacent_cells:
        # raise ValueError(f"Invalid move to position {to_position}")
        return ErrorResponse(error="Invalid move")

    # Query for color of the player
    current_player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if not is_valid_move_direction(current_player.color_id,(int(from_position[1]), int(from_position[3])), (int(to_position[1]), int(to_position[3]))):
        # raise ValueError(f"Invalid move to position {to_position}")
        return ErrorResponse(error="Invalid move")

    # Move the piece
    db.commit()
    db.refresh(piece)

    # Update the piece's position
    piece.position = to_position
    # update the piece's position in the database
    moves = models.Move(
                        piece_id=piece_id, 
                        from_position=from_position, 
                        to_position=to_position, 
                        player_id=piece.player_id, 
                        game_id=game_id
                    )
    db.add(moves)
    db.commit()
    db.refresh(moves)
    # return piece
    return {
        "id": moves.id,
        "piece_id": piece_id,
        "player_id": player_id,
        "game_id": game_id,
        "move_type_id": moves.move_type_id or 0,  # replace None with 0
        "move_order": moves.move_order or 0,  # replace None with 0
        "from_position": str(from_position),
        "to_position": str(to_position),
        "piece_taken": str(moves.piece_taken) or "",  # replace None with empty string
        "is_king": moves.is_king,
    }

# create endpoint to check if cells are empty
@app.get("/empty-cells/{row}/{col}")
def empty_cells(row: int, col: int):
    return get_adjacent_cells(row, col)

# Health check
@app.get("/healthz", response_model=Healthz)
def healthz():
    return {"status": "ok"}