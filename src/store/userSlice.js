import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isLoggedIn: localStorage.getItem("token") ? true : false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user ?? null;
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
      state.isLoggedIn = true;
    },

    logOut: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      state.isLoggedIn = false;
    },
  },
});

export const { setCredentials, logOut } = userSlice.actions;
export default userSlice.reducer;
