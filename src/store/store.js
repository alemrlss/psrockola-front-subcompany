// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Agrega otros slices según sea necesario
  },
});

export default store;
