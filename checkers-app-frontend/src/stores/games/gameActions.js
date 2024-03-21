import axios from "axios";
import { API_URL, AUTH_TOKEN_STORAGE_KEY } from "../../base";
import { gameStarted, setGameData, setGameMoves } from "./gameSlice";

export const gameStart = (schema, navigate) => {
  return async function thunk(dispatch, getState) {
    try {
      dispatch(gameStarted());

      const response = await axios.post(`${API_URL}/player`, schema);
      setGameData(response.data);
      const { player1_id, player2_id, id } = response.data;

      const profileResponse = await axios.post(
        `${API_URL}/create-board/${player1_id}/${player2_id}`
      );
      const player1_name = schema.player1.player_name;
      const player2_name = schema.player2.player_name;

      const finalSchema = {
        ...profileResponse.data,
        player1_id,
        player2_id,
        player1_name,
        player2_name,
        game_id: id,
      };

      dispatch(setGameData(finalSchema));
      dispatch(gameStarted(true));

      navigate("/game_board");
    } catch (error) {
      console.log("Error at login", error.cause);
    }
  };
};

export const gameMoves = (movePiece, navigate) => {
  return async function thunk(dispatch, getState) {
    try {
      const {
        game_id,
        currentPlayer: player_id,
        currentPiece: piece_id,
        fromPos: from_position,
        position: to_position,
      } = movePiece;
      const response = await axios.post(
        `${API_URL}/move-piece/${game_id}/${player_id}/${piece_id}/${from_position}/${to_position}`
      );
      console.log("response: ", response.data);
      dispatch(setGameMoves(response.data));
    } catch (error) {
      console.log("Error at login", error.cause);
    }
  };
};
