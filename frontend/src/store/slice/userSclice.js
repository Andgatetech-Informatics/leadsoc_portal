import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: {}
    },
    reducers: {
        setUser: (state, action) => {
            state.userData = action.payload.user;
        },
        clearUser: (state) => {
            state.userData = {};
        }
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
