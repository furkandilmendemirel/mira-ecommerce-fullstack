import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
};

type AuthState = {
  user: User | null;
  token: string | null;
  hydrated: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.hydrated = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.hydrated = true;
    },
    hydrateAuth(
      state,
      action: PayloadAction<{ user: User | null; token: string | null }>,
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.hydrated = true;
    },
  },
});

export const { login, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
