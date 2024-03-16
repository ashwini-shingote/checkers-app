from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import ValidationError
from datetime import datetime, timezone
from app import database, models
from app.schemas import (
        PlayerBase,
        PlayerCreate,
        GameBase,
        Games,
        GameInitialize,
        Healthz
)

# from app.utils import initialize_board
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
def create_player(player1: PlayerCreate, player2: PlayerCreate, 
                   db: Session = Depends(get_db)):
    player1 = models.Player(player_name=player1.player_name, color_id=1, updated_at=datetime.now(timezone.utc))
    player2 = models.Player(player_name=player2.player_name, color_id=2,updated_at=datetime.now(timezone.utc))
    
    db.add(player1)
    db.add(player2)
    db.commit()
    db.refresh(player1)
    db.refresh(player2)

    game = models.Game(player1_id=player1.id, player2_id=player2.id)
    db.add(game)
    db.commit()
    db.refresh(game)
    return game

# create board with players id received
@app.get("/create-board/{player1_id}/{player2_id}", response_model=GameInitialize)
def create_board(player1_id: int, player2_id: int, db: Session = Depends(get_db)):
    initial_board = initialize_board(player1_id=player1_id, player2_id=player2_id, db=db)
    # return {"board": initial_board}
    return {"board": initial_board, "player1_id": player1_id, "player2_id": player2_id}


# Health check
@app.get("/healthz", response_model=Healthz)
def healthz():
    return {"status": "ok"}