from fastapi import Depends, FastAPI, HTTPException, status
from typing import Union, Any
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from pydantic import ValidationError
from datetime import datetime, timezone
from app import database, models
from app.schemas import (
        ErrorResponse,
        PlayerCreate,
        GameBase,
        GameInitialize,
        MovesUpdate,
        PieceBase,
        Healthz
)
from app.utils import (
        get_adjacent_cells,
        is_valid_move_direction,    
        captured_piece,
        promoted_to_king,
        end_game
)
from app.board import initialize_board

move_type_regular = 1
move_type_captured = 2

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
                        player2_id=player2.id
                      )
    db.add(game)
    db.commit()
    db.refresh(game)
    return game

# create board with players id received
@app.post(
        "/create-board/{player1_id}/{player2_id}", 
        response_model=GameInitialize
        )
def create_board(
                player1_id: int, 
                player2_id: int, 
                db: Session = Depends(get_db)
                ):
    initial_board = initialize_board(player1_id=player1_id, player2_id=player2_id, db=db)
    return {"board": initial_board, "player1_id": player1_id, "player2_id": player2_id}

# move piece
@app.post(
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
    # Query for the player
    current_player = db.query(models.Player).filter(models.Player.id == player_id).first()

    # Check if the piece is at the expected position
    if piece.position != str(from_position) or piece.position == "":
        return ErrorResponse(error="Piece is not at given start position")

    from_row, from_col = map(int, from_position.strip('{}').split(','))
    to_row, to_col = map(int, to_position.strip('{}').split(','))

    # Validate move direction
    if not is_valid_move_direction(
                        current_player.color_id,
                        from_row,
                        to_row,
                        to_col):
        return ErrorResponse(error="Invalid move direction")

    # Get empty valid movement cells
    adjacent_empty_cells = get_adjacent_cells(
                        from_position, 
                        to_position,
                        player_id,
                        db
                        )
    
    if (to_row, to_col) not in adjacent_empty_cells:
        return ErrorResponse(error="Invalid move")
    
    captured_piece_id = captured_piece(from_row, from_col, to_row, to_col, player_id, db)

    # update the piece's position in the database
    piece.position = to_position
    db.commit()
    db.refresh(piece)

    is_now_king = promoted_to_king(piece_id, to_row, player_id, db)

    moves = models.Move(
                        piece_id=piece_id, 
                        from_position=from_position, 
                        to_position=to_position, 
                        player_id=piece.player_id, 
                        game_id=game_id,
                        piece_taken=captured_piece_id,
                        is_king=is_now_king,
                        move_type_id=move_type_regular if captured_piece_id is 0 else move_type_captured
                        )

    db.add(moves)
    db.commit()
    db.refresh(moves)

    # Check if the game is over
    if is_now_king:
        end_game(game_id, db)

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
            "is_king": is_now_king,
    }

# Health check
@app.get("/healthz", response_model=Healthz)
def healthz():
    return {"status": "ok"}