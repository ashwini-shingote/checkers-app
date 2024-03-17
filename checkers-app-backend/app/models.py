from .database import Base
from sqlalchemy import Boolean, CheckConstraint, Column, Integer, String ,Time, DateTime, Float, ForeignKey, func
from sqlalchemy.orm import relationship

class Player(Base):
    __tablename__ = "players"
    
    id = Column(Integer, primary_key=True, index=True)
    player_name = Column(String, index=True)
    color_id = Column(Integer) #1 for black, 2 for white
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    # Define relationship
    moves = relationship("Move", back_populates="player")
    piece = relationship("Piece", back_populates="player")

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    player1_id = Column(Integer, ForeignKey('players.id'))
    player2_id = Column(Integer, ForeignKey('players.id'))
    is_finished = Column(Boolean, default=False)
    # winner = Column(String, default=None)

    # Define relationship
    moves = relationship("Move", back_populates="game")
    player1 = relationship("Player", foreign_keys=[player1_id])
    player2 = relationship("Player", foreign_keys=[player2_id])
  
class Piece(Base):
    __tablename__ = "pieces"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    position = Column(String)
    is_out = Column(Boolean, default=False)
    player_id = Column(Integer, ForeignKey('players.id'))

    # Define relationship
    player = relationship("Player", back_populates="piece")
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
    