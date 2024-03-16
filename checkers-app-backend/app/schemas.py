from pydantic import BaseModel
from datetime import datetime

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
# ---------------------------------------------------------------
# for Health check
class Healthz(BaseModel):
    status: str
