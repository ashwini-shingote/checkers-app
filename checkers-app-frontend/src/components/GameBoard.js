import React, { useState } from "react";
import Row from "./Row";

import Popup from "./Popup";
// import { aboutGame } from "./constants";
import { useDispatch, useSelector } from "react-redux";
import { getGame } from "../stores/games/gameSelectors";
import { aboutGame } from "./about";

const GameBoard = () => {
  const [board, setBoard] = useState([
    ["-", "b-1", "-", "b-2", "-", "b-3", "-", "b-4"],
    ["b-5", "-", "b-6", "-", "b-7", "-", "b-8", "-"],
    ["-", "b-9", "-", "b-10", "-", "b-11", "-", "b-12"],
    ["-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-"],
    ["r-13", "-", "r-14", "-", "r-15", "-", "r-16", "-"],
    ["-", "r-17", "-", "r-18", "-", "r-19", "-", "r-20"],
    ["r-21", "-", "r-22", "-", "r-23", "-", "r-24", "-"],
  ]);

  const { game_id, player1_id, player2_id, player1_name, player2_name } =
    useSelector(getGame);
  const [activePlayer, setActivePlayer] = useState("r");
  const [popShown, setPopShown] = useState(false);
  const [fromPos, setFromPos] = useState("");
  const [currentPiece, setCurrentPiece] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(player1_id);

  const movePiece = (board, from_position, to_position) => {
    // Extracting row and column indices from the positions
    const fpos = JSON.parse(from_position);
    const tpos = JSON.parse(to_position);
    var from_row = fpos[0];
    var from_col = fpos[1];
    var to_row = tpos[0];
    var to_col = tpos[1];

    // Moving the piece
    board[to_row][to_col] = board[from_row][from_col];
    board[from_row][from_col] = "-";

    return board;
  };

  const handlePieceClick = (e) => {
    // Functionality to handle piece click
    const rIndex = e.currentTarget.getAttribute("data-row");
    const cIndex = e.currentTarget.getAttribute("data-cell");
    const pIndex = e.currentTarget.getAttribute("data-piece");
    const pieceId = parseInt(pIndex);
    const position = rIndex + "," + cIndex; //"{"+rIndex+","+cIndex+"}";

    if (fromPos === "" && !isNaN(pieceId)) {
      setFromPos(position);
      setCurrentPiece(pieceId);
      console.log(
        "get: player-" +
          currentPlayer +
          ": pid-" +
          pieceId +
          ", {" +
          rIndex +
          "," +
          cIndex +
          "}"
      );
    } else if (fromPos !== "" && !isNaN(pieceId)) {
      // Get API Call here
      console.log("set: " + pIndex + ", {" + rIndex + "," + cIndex + "}");
      // console.log(`D: /move-piece/2/3/11/{2,5}/{3,6}`);
      console.log(
        `/move-piece/${game_id}/${currentPlayer}/${parseInt(
          currentPiece
        )}/${`{${fromPos}}`}/${`{${position}}`}`
      );
      var updated_board = movePiece(
        board,
        `${`[${fromPos}]`}`,
        `${`[${position}]`}`
      );
      console.log(updated_board);
      setFromPos("");
      setCurrentPiece(0);
      setCurrentPlayer(currentPlayer === player1_id ? player2_id : player1_id);
    } else {
      console.log("Invalid move!!");
    }
  };

  const aboutPopOpen = (e) => {
    e.preventDefault();
    setPopShown(true);
  };

  const aboutPopClose = (e) => {
    e.preventDefault();
    setPopShown(false);
  };

  return (
    <div id="start_menu" className="row">
      <div className="col">
        <div className="row text-center justify-content-center h-100">
          <div className="col-10 start_menu_bg">
            <div className="board-wrapper">
              <div className="col-2 mt-5 border border-2 border-dark p-1">
                <h4>Player 1: {player1_name}</h4>
              </div>
              <div className="container_board mt-5">
                <div className={"board " + activePlayer}>
                  {board.map((row, index) => (
                    <Row
                      key={index}
                      rowArr={row}
                      handlePieceClick={handlePieceClick}
                      rowIndex={index}
                    />
                  ))}
                </div>
                <div className="clear"></div>
                <button onClick={aboutPopOpen}>About</button>
                <Popup
                  shown={popShown}
                  close={aboutPopClose}
                  copy={aboutGame}
                />
              </div>
              <div className="col-2 mt-5 border border-2 border-danger p-1">
                <h4>Player 2: {player2_name}</h4>
              </div>
            </div>
            <a href="/" className="mt-2">
              Start Game
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
