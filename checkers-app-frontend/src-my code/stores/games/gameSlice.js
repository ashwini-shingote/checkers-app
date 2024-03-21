import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  gameStarted: false,
  gameData: {
    game_id: 2,
    player1_id: 3,
    player2_id: 4,
    player1_name: "Tom",
    player2_name: "Tim",
    is_finished: false,
  },
  gameMoves: {},
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    gameStarted: (state) => {
      state.loading = true;
    },
    setGameData: (state, action) => {
      state.gameData = action.payload;
      state.loading = false;
    },
    setGameMoves: (state, action) => {
      state.gameMoves = action.payload;
      state.loading = false;
    },
    reset: (state) => {
      return initialState;
    },
  },
});

export const { gameStarted, setGameData, setGameMoves, reset } =
  gameSlice.actions;

export default gameSlice.reducer;
