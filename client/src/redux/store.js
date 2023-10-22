import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js"; // we are exporting userSlice.reducer as default and importing here as 'userReducer'

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
