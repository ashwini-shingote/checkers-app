import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./games/gameSlice";

const store = configureStore({
  reducer: {
    game: gameReducer,
  },
});

export default store;
