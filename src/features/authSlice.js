// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./AuthService.js";

// Función de verificación al cargar la aplicación
const checkAuthentication = () => {
  const token = localStorage.getItem("token");
  return !!token;
};
//s

const checkInitialUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const loginSubcompany = createAsyncThunk(
  "auth/loginSubcompany",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.loginSubcompany(credentials);
      localStorage.setItem("token", response.token);
      localStorage.setItem("tokenExpiration", response.tokenExpiration);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("language", response.user.language);

      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Error during login");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: checkInitialUser(),
    token: localStorage.getItem("token"),
    tokenExpiration: null,
    isAuthenticated: checkAuthentication(),
    status: "idle",
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null; // Funcion para limpiar el Error del Auth.
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setTokenExpiration: (state, action) => {
      state.tokenExpiration = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.tokenExpiration = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("user");
      localStorage.removeItem("language");
    },
    updateUserBalance: (state, action) => {
      if (state.user) {
        state.user.balance = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    updateUserMembership: (state, action) => {
      if (state.user) {
        state.user.membership = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    updatePhoto: (state, action) => {
      if (state.user) {
        state.user.photo = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginSubcompany.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginSubcompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.tokenExpiration = action.payload.tokenExpiration;
        state.isAuthenticated = true; // Autenticado después del inicio de sesión exitoso
      })
      .addCase(loginSubcompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error during login";
        state.isAuthenticated = false; // Restablecer la autenticación en caso de error
      });
  },
});

export const {
  setUser,
  setToken,
  setTokenExpiration,
  logout,
  updateUserBalance,
  updateUserMembership,
  clearError,
  updateUser,
  updatePhoto,
} = authSlice.actions;
export default authSlice.reducer;
