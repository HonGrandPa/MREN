import { createSlice } from "@reduxjs/toolkit";


//initial toy box is empty 
const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        signInStart: (state) => {

            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload; //<-user infor ex. email,username, password
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {

            state.error = action.payload; // <-error info
            state.loading = false;

        }
    }

});

//automatically generate these thress action 
export const {signInStart, signInFailure, signInSuccess} = userSlice.actions;

export default userSlice.reducer;
