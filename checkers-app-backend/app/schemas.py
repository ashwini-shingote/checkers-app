from pydantic import BaseModel
from datetime import datetime
from typing import List


class ErrorResponse(BaseModel):
    error: str

class PlayerBase(BaseModel):
    # id: int # later remove this id, when user is logs in from frontend
    player_name: str
    color_id: int

class PlayerCreate(PlayerBase):
    pass

class Players(PlayerBase):
    id: int
    player_name: str
    color_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class GameBase(BaseModel):
    id: int
    player1_id: int
    player2_id: int
    is_finished: bool

class Games(GameBase):
    pass

class GameInitialize(BaseModel):
    player1_id: int
    player2_id: int

class MoveBase(BaseModel):
    id: int
    piece_id: int
    game_id: int
    player_id: int
    move_type_id: int
    move_order: int
    from_position: str
    # from_position: str(List[int,int]) # type: ignore
    to_position: str
    piece_taken: str
    is_king: bool

class MovesUpdate(MoveBase):
    piece_id: int
    from_position: str
    to_position: str    

class PieceBase(BaseModel):
    id: int
    name: str
    starting_position: str
    player_id: int

# ---------------------------------------------------------------
# for Health check
class Healthz(BaseModel):
    status: str
