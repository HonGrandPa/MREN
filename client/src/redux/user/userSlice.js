import { createSlice } from "@reduxjs/toolkit";


//initial toy box is empty 
const initialState = {
    currentUser: null, //<-- this is going to store user infor ex password id email...
    error: null,
    isLoading: false,
};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        signInStart: (state) => {

            state.isLoading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload; //<-user infor ex. email,username, password
            state.isLoading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {

            state.error = action.payload; // <-error info
            state.isLoading = false;

        }
    }

});

//automatically generate these thress action 
export const {signInStart, signInFailure, signInSuccess} = userSlice.actions;

export default userSlice.reducer;
