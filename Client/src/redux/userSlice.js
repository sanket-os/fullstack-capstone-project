import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "users",
    initialState: {
        user: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;