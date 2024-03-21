import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { gameMoves } from "../stores/games/gameActions";
import { getGame } from "../stores/games/gameSelectors";
import { reset } from "../stores/games/gameSlice";
import Star from "./star.svg";

import Row from "./Row";
import Popup from "./Popup";
import { aboutGame } from "./about";
import { Image } from "react-bootstrap";

const CherckersBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const [activePlayer, setActivePlayer] = useState("b");
  const [popShown, setPopShown] = useState(false);
  const [fromPos, setFromPos] = useState("");
  const [currentPiece, setCurrentPiece] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(player1_id);
  // sate variable use to check for current player's turn
  const [isPlayer1sTurn, setIsPlayer1sTurn] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

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
    dispatch(gameMoves(movePiece, navigate));
    return board;
  };

  const getPiece = (r, c) => {
    return board[r][c];
  };

  const checkAdjusentCols = (fromPosition) => {
    const cPos = fromPosition.split(",");
    const cRow = parseInt(cPos[0]);
    const cCol = parseInt(cPos[1]);
    const toCheckRow = cRow + 1;
    const toCheckLeftCol = cCol - 1;
    const toCheckRightCol = cCol + 1;
    const toCheckRowForRed = cRow - 1;
    const toCheckLeftColForRed = cCol - 1;
    const toCheckRightColForRed = cCol + 1;
    if (
      activePlayer === "b" &&
      toCheckRow < 8 &&
      (toCheckLeftCol >= 0 || toCheckLeftCol < 8) &&
      (toCheckRightCol < 8 || toCheckRightCol >= 0)
    ) {
      let leftPiece = getPiece(toCheckRow, toCheckLeftCol);
      let rightPiece = getPiece(toCheckRow, toCheckRightCol);
      console.log("Left piece: " + leftPiece + ", Right piece: " + rightPiece);
    }
    if (
      activePlayer === "r" &&
      toCheckRowForRed >= 0 &&
      (toCheckLeftColForRed >= 0 || toCheckLeftColForRed < 8) &&
      (toCheckRightColForRed < 8 || toCheckRightColForRed >= 0)
    ) {
      let leftPiece = getPiece(toCheckRowForRed, toCheckLeftColForRed);
      let rightPiece = getPiece(toCheckRowForRed, toCheckRightColForRed);
      console.log(
        "Left piece for red: " +
          leftPiece +
          ", Right piece for red: " +
          rightPiece
      );
    }
  };

  const validMoves = (toRoww, toColl) => {
    const toRow = parseInt(toRoww);
    const toCol = parseInt(toColl);
    const crc = fromPos.split(",");
    const cRow = parseInt(crc[0]);
    const cCol = parseInt(crc[1]);
    const pRow = cRow + 1;
    const pCol = cCol + 1;
    const pRedRow = cRow - 1;
    const pRedCol = cCol - 1;

    const isValidCol =
      toCol !== cCol && (toCol === cCol + 1 || toCol === cCol - 1);
    const isValidRC = cRow !== toRow && cCol !== toCol; //&& isValidCol;
    const isValidJumpForBlack =
      pRow < board.length &&
      pCol < board[0].length &&
      toRow >= cRow + 2 &&
      board[pRow][pCol].split("-")[0] === "r";
    // const isValidJumpForBlack =
    //   toRow >= cRow + 2 && board[pRow][pCol].split("-")[0] === "r";
    console.log("Board is: ", board[pRow][pCol]);
    console.log("is color:", board[pRow][pCol].split("-")[0]);
    console.log("isValidJumpForBlack: ", isValidJumpForBlack);
    // const isValidBlackRow =
    //   toRow > cRow && (toRow === cRow + 1 || toRow === cRow + 2);
    const isValidBlackRow =
      toRow > cRow && (toRow === cRow + 1 || isValidJumpForBlack);
    board[pRow][pCol] = "";
    const isValidJumpForRed =
      pRedRow >= 0 &&
      pRedCol >= 0 &&
      toRow <= cRow - 2 &&
      board[pRedRow][pRedCol].split("-")[0] === "b";
    // const isValidJumpForRed =
    //   toRow <= cRow - 2 && board[pRedRow][pRedCol].split("-")[0] === "b";
    // const isValidRedRow =
    //   toRow < cRow && (toRow === cRow - 1 || toRow === cRow - 2);
    const isValidRedRow =
      toRow < cRow && (toRow === cRow - 1 || isValidJumpForRed);

    if (activePlayer === "b" && isValidBlackRow && isValidRC) {
      return true;
    }
    if (activePlayer === "r" && isValidRedRow && isValidRC) {
      return true;
    }
    // console.log(board[cRow + 1][cCol + 1]);
    // const pieceColor = board[cRow + 1][cCol + 1];
    // console.log("color of the piece is: ", pieceColor);
    // const validPieceColor = pieceColor.split("-")[0];
    // console.log("color of the piece is1: ", validPieceColor);
    return false;
  };

  const handlePieceClick = (e) => {
    // Functionality to handle piece click
    const rIndex = e.currentTarget.getAttribute("data-row");
    const cIndex = e.currentTarget.getAttribute("data-cell");
    const pIndex = e.currentTarget.getAttribute("data-piece");
    const pieceId = parseInt(pIndex);
    const position = rIndex + "," + cIndex;
    if (!isNaN(pieceId)) {
      setFromPos(position);
      setCurrentPiece(pieceId);
      checkAdjusentCols(position);
      console.log(
        "get: player" +
          currentPlayer +
          ": " +
          pieceId +
          ", {" +
          rIndex +
          "," +
          cIndex +
          "}"
      );
    } else if (fromPos !== "" && currentPiece > 0 && isNaN(pieceId)) {
      if (validMoves(rIndex, cIndex)) {
        console.log("set: " + pIndex + ", {" + rIndex + "," + cIndex + "}");
        const setMovePiece = {
          game_id,
          currentPlayer,
          currentPiece: parseInt(currentPiece),
          fromPos: `{${fromPos}}`,
          position: `{${position}}`,
        };
        dispatch(gameMoves(setMovePiece));
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
        console.log("updated board: ", updated_board);
        setFromPos("");
        setCurrentPiece(0);
        setCurrentPlayer(
          currentPlayer === player1_id ? player2_id : player1_id
        );
        setActivePlayer(activePlayer === "b" ? "r" : "b");
        // switch player's turn
        setIsPlayer1sTurn(!isPlayer1sTurn);
      } else {
        alert("Wrong move!");
      }
    }
  };
  const reset = () => {
    dispatch(reset());
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
      {/* <div className="clear"></div>
      <button onClick={reset}>Reset</button>
      <button onClick={aboutPopOpen}>About</button>
      <Popup shown={popShown} close={aboutPopClose} copy={aboutGame} /> */}
      <div className="col">
        <div className="row text-center justify-content-center h-100">
          <div className="col-10 start_menu_bg">
            <div className="board-wrapper">
              <div className="col-2 mt-5 border border-2 border-dark p-1">
                <h4>Player 1: {player1_name}</h4>
                {activePlayer === "b" && (
                  <Image src={Star} style={{ width: "30px" }}></Image>
                )}
              </div>
              <div className="container_board mt-5">
                <div className={"board " + activePlayer}>
                  {board.map((row, index) => (
                    <Row
                      key={index}
                      rowArr={row}
                      handlePieceClick={handlePieceClick}
                      rowIndex={index}
                      isDisabled={isDisabled}
                    />
                  ))}
                </div>
                {isDisabled && <p>Wait for your turn</p>}
                {/* <div className="clear"></div>
                <button onClick={reset}>Reset</button>
                <button onClick={aboutPopOpen}>About</button>
                <Popup
                  shown={popShown}
                  close={aboutPopClose}
                  copy={aboutGame}
                /> */}
              </div>
              <div className="col-2 mt-5 border border-2 border-danger p-1">
                <h4>Player 2: {player2_name}</h4>
                {activePlayer === "r" && (
                  <Image src={Star} style={{ width: "30px" }}></Image>
                )}
              </div>
            </div>
            <a href="/" className="mt-2">
              {/* Start Game */}
              Go to Login Page
            </a>
            <h3>Whos turn: {isPlayer1sTurn ? player1_name : player2_name} </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CherckersBoard;
