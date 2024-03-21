import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { gameMoves } from "../stores/games/gameActions";
import { getGame } from "../stores/games/gameSelectors";
import red_peice from "./token_red.svg";
import black_peice from "./token_black.svg";

import Row from "./Row";
import Popup from "./Popup";
import { aboutGame, winnerMessage } from "./about";
import { Image } from "react-bootstrap";

const CheckersBoard = () => {
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
  const { game_id, player1_id, player2_id, player1_name, player2_name } = useSelector(getGame);
  const [activePlayer, setActivePlayer] = useState("b");
  const [popShown, setPopShown] = useState(false);
  const [popAboutShown, setPopAboutShown] = useState(false);
  const [fromPos, setFromPos] = useState("");
  const [currentPiece, setCurrentPiece] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(player1_id);
  // sate variable use to check for current player's turn
  const [isPlayer1sTurn, setIsPlayer1sTurn] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [availMoves, setAvailMoves] = useState(null);
  const [takenPiece, setTakenPiece] = useState("");
  const [takenByPlayer1, setTakenByPlayer1] = useState([]);
  const [takenByPlayer2, setTakenByPlayer2] = useState([]);

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

  // this new code for getPiece function
  const getPiece = (row, col) => {
    if (row >= 0 && row < board.length && col >= 0 && col < board[0].length) {
      return board[row][col];
    }
    return null;
  };

  const checkPieceColor = (toCheck, move) => {
    const pieceColor = toCheck && toCheck.split("-")[0];
    if (toCheck === "-") {
      return [move, 1];
    }
    if (pieceColor && pieceColor !== activePlayer) {
      return [move, 2];
    }
    return false;
  };

  const checkAdjusentCols = (fromPosition) => {
    const cPos = fromPosition.split(",");
    const cRow = parseInt(cPos[0]);
    const cCol = parseInt(cPos[1]);
    const downRow = cRow + 1;
    const upRow = cRow - 1;
    const toCheckLeftCol = cCol - 1;
    const toCheckRightCol = cCol + 1;
    let leftPiece = "",
      rightPiece = "";
    if (
      activePlayer === "b" &&
      downRow > 0 &&
      downRow < 8 &&
      (toCheckLeftCol >= 0 || toCheckLeftCol < 8) &&
      (toCheckRightCol < 8 || toCheckRightCol >= 0)
    ) {
      leftPiece = getPiece(downRow, toCheckLeftCol);
      rightPiece = getPiece(downRow, toCheckRightCol);
      const isValidLeft = checkPieceColor(leftPiece, "left"); //["left", 2]
      const isValidRight = checkPieceColor(rightPiece, "right"); //["right", 1]

      let nextLVal = "",
        nextRVal = "";
      // if (isValidLeft && isValidLeft[1] === 2 && downRow !== 7) {
      if (
        isValidLeft &&
        isValidLeft.length > 1 &&
        isValidLeft[1] === 2
      ) {
        nextLVal = getPiece(
          downRow + 1,
          isValidLeft[0] === "left" && toCheckLeftCol - 1
        );
        console.log("Is next left is empty: " + nextLVal);
      }
      // if (isValidRight && isValidRight[1] === 2 && downRow !== 7) {
      if (
        isValidRight &&
        isValidRight.length > 1 &&
        isValidRight[1] === 2
      ) {
        nextRVal = getPiece(
          downRow + 1,
          isValidRight[0] === "right" && toCheckRightCol + 1
        );
        console.log("Is next right is empty: " + nextRVal);
      }
      console.log(
        "B-Left piece: " + leftPiece + ", Right piece: " + rightPiece
      );
      console.log(
        "B-Left piece is valid-: " +
          isValidLeft +
          ", Right piece is valid: " +
          isValidRight
      );
      console.log(
        "B-Next left val-: " + nextLVal + ", Next right val: " + nextRVal
      );
      // const final = `{left: [${isValidLeft && nextLVal==="-"? ["left", 2] : isValidLeft && nextLVal===""? ["left", 1] : false}], right: [${isValidRight && nextRVal==="-"? ["right", 2] : isValidRight && nextRVal===""? ["right", 1] : false}]}`
      const final = `{"left": ${
        isValidLeft && nextLVal === "-"
          ? `[${downRow + 1}, ${
              toCheckLeftCol - 1
            }, ${downRow}, ${toCheckLeftCol}]`
          : isValidLeft && nextLVal === ""
          ? `[${downRow}, ${toCheckLeftCol}]`
          : false
      }, "right": ${
        isValidRight && nextRVal === "-"
          ? `[${downRow + 1}, ${
              toCheckRightCol + 1
            }, ${downRow}, ${toCheckRightCol}]`
          : isValidRight && nextRVal === ""
          ? `[${downRow}, ${toCheckRightCol}]`
          : false
      }}`;
      const finalObject = JSON.parse(final);
      return finalObject;
    }
    if (
      activePlayer === "r" &&
      upRow >= 0 &&
      upRow < 7 &&
      (toCheckLeftCol >= 0 || toCheckLeftCol < 8) &&
      (toCheckRightCol < 8 || toCheckRightCol >= 0)
    ) {
      leftPiece = getPiece(upRow, toCheckLeftCol);
      rightPiece = getPiece(upRow, toCheckRightCol);
      const isValidLeft = checkPieceColor(leftPiece, "left"); //["left", 2]
      const isValidRight = checkPieceColor(rightPiece, "right"); //["right", 1]

      let nextLVal = "",
        nextRVal = "";
      if (isValidLeft && isValidLeft[1] === 2) {
        nextLVal = getPiece(
          upRow - 1,
          isValidLeft[0] === "left" && toCheckLeftCol - 1
        );
        console.log("Is next left is empty: " + nextLVal);
      }
      if (isValidRight && isValidRight[1] === 2) {
        nextRVal = getPiece(
          upRow - 1,
          isValidRight[0] === "right" && toCheckRightCol + 1
        );
        console.log("Is next right is empty: " + nextRVal);
      }
      console.log(
        "R-Left piece: " + leftPiece + ", Right piece: " + rightPiece
      );
      console.log(
        "R-Left piece is valid-: " +
          isValidLeft +
          ", Right piece is valid: " +
          isValidRight
      );
      console.log(
        "R-Next left val-: " + nextLVal + ", Next right val: " + nextRVal
      );

      // const final = `{left: [${isValidLeft && nextLVal==="-"? ["left", 2] : isValidLeft && nextLVal===""? ["left", 1] : false}], right: [${isValidRight && nextRVal==="-"? ["right", 2] : isValidRight && nextRVal===""? ["right", 1] : false}]}`
      const final = `{"left": ${
        isValidLeft && nextLVal === "-"
          ? `[${upRow - 1}, ${toCheckLeftCol - 1}, ${upRow}, ${toCheckLeftCol}]`
          : isValidLeft && nextLVal === ""
          ? `[${upRow}, ${toCheckLeftCol}]`
          : false
      }, "right": ${
        isValidRight && nextRVal === "-"
          ? `[${upRow - 1}, ${
              toCheckRightCol + 1
            }, ${upRow}, ${toCheckRightCol}]`
          : isValidRight && nextRVal === ""
          ? `[${upRow}, ${toCheckRightCol}]`
          : false
      }}`;
      const finalObject = JSON.parse(final);
      return finalObject;
    }
  };

  const validMoves = (toRoww, toColl) => {
    const toRow = parseInt(toRoww);
    const toCol = parseInt(toColl);
    const crc = fromPos.split(",");
    const cRow = parseInt(crc[0]);
    const cCol = parseInt(crc[1]);
    let leftAvails = availMoves.left;
    let rightAvails = availMoves.right;
    const isValidCol =
      toCol !== cCol && (toCol === cCol + 1 || toCol === cCol - 1);
    const isValidRC = cRow !== toRow && cCol !== toCol && isValidCol;
    const isValidBlackRow =
      toRow > cRow && (toRow === cRow + 1 || toRow === cRow + 2);
    const isValidRedRow =
      toRow < cRow && (toRow === cRow - 1 || toRow === cRow - 2);
    let tookPiece = "";
    if (activePlayer === "b") {
      if (leftAvails && leftAvails[0] === toRow && leftAvails[1] === toCol) {
        if (leftAvails[2] && leftAvails[3]) {
          tookPiece = getPiece(leftAvails[2], leftAvails[3]);
          // setTakenPiece(tookPiece)
          setTakenByPlayer1([...takenByPlayer1, tookPiece]);
        }
        return [true, tookPiece];
      }
      if (rightAvails && rightAvails[0] === toRow && rightAvails[1] === toCol) {
        if (rightAvails[2] && rightAvails[3]) {
          tookPiece = getPiece(rightAvails[2], rightAvails[3]);
          // setTakenPiece(tookPiece)
          setTakenByPlayer1([...takenByPlayer1, tookPiece]);
        }
        return [true, tookPiece];
      }
      if (isValidBlackRow && isValidRC) {
        return [true, tookPiece];
      }
    }
    if (activePlayer === "r") {
      if (leftAvails && leftAvails[0] === toRow && leftAvails[1] === toCol) {
        if (leftAvails[2] && leftAvails[3]) {
          tookPiece = getPiece(leftAvails[2], leftAvails[3]);
          // setTakenPiece(tookPiece)
          setTakenByPlayer2([...takenByPlayer2, tookPiece]);
        }
        return [true, tookPiece];
      }
      if (rightAvails && rightAvails[0] === toRow && rightAvails[1] === toCol) {
        if (rightAvails[2] && rightAvails[3]) {
          tookPiece = getPiece(rightAvails[2], rightAvails[3]);
          // setTakenPiece(tookPiece)
          setTakenByPlayer2([...takenByPlayer2, tookPiece]);
        }
        return [true, tookPiece];
      }
      if (isValidRedRow && isValidRC) {
        return [true, tookPiece];
      }
    }
    // if(activePlayer==="b" && isValidBlackRow && isValidRC){
    //   return true
    // }
    // if(activePlayer==="r" && isValidRedRow && isValidRC){
    //   return true
    // }
    return false;
  };

  // Remove taken piece from board
  const handleTakenPiece = (piece, boardUp) => {
    const updatedBoard = boardUp.map((row) =>
      row.map((cell) => {
        if (cell === piece) {
          return "-";
        }
        return cell;
      })
    );
    setBoard(updatedBoard);
    // setTakenPiece("")
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
      let canMoves = checkAdjusentCols(position);
      console.log("Moves avail: ", canMoves);
      setAvailMoves(canMoves);
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
      // Get API Call here
      let isValid = validMoves(rIndex, cIndex);
      if (isValid && isValid[0]) {
        console.log("set: " + pIndex + ", {" + rIndex + "," + cIndex + "}");
        // console.log(`D: /move-piece/2/3/11/{2,5}/{3,6}`);
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
          `${`[${position}]`}`,
          isValid[1]
        );
        console.log("updated board: ", updated_board);
        handleTakenPiece(isValid[1], updated_board);

        setFromPos("");
        setCurrentPiece(0);
        setCurrentPlayer(
          currentPlayer === player1_id ? player2_id : player1_id
        );
        setTimeout(() => {
          setPopShown(activePlayer==="r" && rIndex==="0" || activePlayer==="b" && rIndex==="7")
          setActivePlayer(activePlayer === "b" ? "r" : "b");
          // switch player's turn
          setIsPlayer1sTurn(!isPlayer1sTurn);          
        }, 1500);
      } else {
        alert("Wrong move!");
      }
    }
  };

  const winnerPopClose = (e) => {
    e.preventDefault();
    setPopShown(false);
  };

  const aboutPopOpen = (e) => {
    e.preventDefault();
    setPopAboutShown(true);
  };

  const aboutPopClose = (e) => {
    e.preventDefault();
    setPopAboutShown(false);
  };

  return (
    <div id="start_menu" className="row">
      <Popup
        shown={popShown}
        close={winnerPopClose}
        message={winnerMessage}
        name={activePlayer === "b" ? player2_name : player1_name}
      />
      <Popup
        shown={popAboutShown}
        close={aboutPopClose}
        message={aboutGame}
        name={""}
      />
      <div className="col">
        <div className="row text-center justify-content-center h-100">
          <div className="col-10 start_menu_bg">
            <h3 className="mt-5"> {player1_name} {isPlayer1sTurn ? <Image src={black_peice} style={{ width: "50px" }} />:""} </h3>
            <div className="board-wrapper">
              <div className="col-2 mt-2 border border-2 border-dark p-1">
                <h4>Player 1: {player1_name}</h4>
                {takenByPlayer1.length > 0 && (
                  <ul style={{listStyle:"none",paddingLeft:0}}>
                    {takenByPlayer1.map((taken, tid) => {
                      return (
                        <li key={`t1p${tid}`}>
                          <Image src={red_peice} style={{ width: "35px" }} />
                          {/* {taken} */}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className="container_board mt-2">
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
              </div>
              <div className="col-2 mt-2 border border-2 border-danger p-1">
                <h4>Player 2: {player2_name}</h4>
                {takenByPlayer2.length > 0 && (
                  <ul style={{listStyle:"none",paddingLeft:0}}>
                    {takenByPlayer2.map((taken, tid) => {
                      return (
                        <li key={`t2p${tid}`}>
                          <Image src={black_peice} style={{ width: "35px" }} />
                          {/* {taken} */}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
            <h3 className="mt-3"> {player2_name} {isPlayer1sTurn ? "": <Image src={red_peice} style={{ width: "50px" }} />} </h3>
            <hr/>
            <a href="/" className="mt-2">
              Go to Login Page
            </a>
            <div className="d-flex justify-content-center">
              <button className="btn btn-secondary btn-sm" onClick={aboutPopOpen}>About</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckersBoard;
