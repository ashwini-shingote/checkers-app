from .database import Base
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

class Player(Base):
    __tablename__ = "players"
    
    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, index=True)

    # Define relationship
    moves = relationship("Move", back_populates="player")

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    is_finished = Column(Boolean, default=False)
    winner = Column(String, default=None)

    # Define relationship
    moves = relationship("Move", back_populates="game")
  
class Piece(Base):
    __tablename__ = "pieces"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    starting_position = Column(String)

    # Define relationship
    moves = relationship("Move", back_populates="piece")

class Move(Base):
    __tablename__ = "moves"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    piece_id = Column(Integer, ForeignKey('pieces.id'))
    game_id = Column(Integer, ForeignKey("games.id"))
    player_id = Column(Integer, ForeignKey("players.id"))
    move_type_id = Column(Integer, ForeignKey("move_types.id"))
    move_order = Column(Integer)
    from_position = Column(String)
    to_position = Column(String)
    piece_taken = Column(String)
    is_king = Column(Boolean, default=False)

    # Define relationship
    piece = relationship("Piece", back_populates="moves")
    game = relationship("Game", back_populates="moves")
    player = relationship("Player", back_populates="moves")
    move_type = relationship("MoveType", back_populates="moves")

class MoveType(Base):
    __tablename__ = 'move_types'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    
    # Define relationship
    moves = relationship("Move", back_populates="move_type")
    