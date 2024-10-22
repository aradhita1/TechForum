import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  userId: number | null;
  name: string | null;
  email: string | null;
  role: string | null;
}

const initialState: UserState = {
  userId: null,
  name: null,
  email: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
