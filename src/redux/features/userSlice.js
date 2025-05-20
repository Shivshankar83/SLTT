import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  userId: null,
  email: null,
  role: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { username, userId, email, role } = action.payload;
      state.username = username;
      state.userId = userId;
      state.email = email;
      state.role = role || "ADMIN"; // Default to ADMIN if role is null or undefined
      state.isAuthenticated = true;
      console.log("User set in Redux:", { username, userId, email, role: state.role });
    },
    clearUser: (state) => {
      state.username = null;
      state.userId = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
      console.log("User cleared from Redux");
    },
  },
});

// Export actions
export const { setUser, clearUser } = userSlice.actions;

// Export selectors
export const selectUser = (state) => state.user;
export const selectUsername = (state) => state.user.username;
export const selectUserId = (state) => state.user.userId;
export const selectEmail = (state) => state.user.email;
export const selectRole = (state) => state.user.role;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;

export default userSlice.reducer;