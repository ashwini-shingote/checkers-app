import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { gameStart } from "../stores/games/gameActions";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

function StartGame() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [error, setError] = useState(null);

  const startGame = (e) => {
    // check if both players name are empty if yes set default names
    const playerName1 = player1 === "" ? "Me" : player1;
    const playerName2 = player2 === "" ? "You" : player2;

    const schema = {
      player1: {
        player_name: playerName1,
        color_id: 1, // 1 for black
      },
      player2: {
        player_name: playerName2,
        color_id: 2, // 2 for red
      },
    };
    dispatch(gameStart(schema, navigate));
  };

  const btnStyle = {
    border: "2px solid cornflowerblue",
    fontWeight: "bold",
    letterSpacing: "2px",
  };
  return (
    <Container>
      <div id="start_menu" className="row">
        <div className="col">
          <div className="row text-center justify-content-center h-100">
            <div className="col-10 start_menu_bg">
              <h1 className="display-4 text-dark font-weight-bolder mt-5">
                Checkers
              </h1>
              <h3>2 Players</h3>
              <br />

              <div className="d-flex justify-content-center my-5">
                <div className="d-flex flex-column">
                  <input
                    type="text"
                    className="player-name"
                    value={player1}
                    placeholder="Player 1"
                    onChange={(e) => setPlayer1(e.target.value)}
                  />
                  <span className="help-text">(Black)</span>
                </div>{" "}
                <div className="d-flex flex-column">
                  <input
                    type="text"
                    className="player-name"
                    value={player2}
                    placeholder="Player 2"
                    onChange={(e) => setPlayer2(e.target.value)}
                  />
                  <span className="help-text">(Red)</span>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-info"
                  id="start_btn"
                  style={btnStyle}
                  onClick={startGame}
                >
                  Start Game
                </button>
              </div>
              {/* <a href="/game_board">Game Board</a> */}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default StartGame;
