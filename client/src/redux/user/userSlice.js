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

        initial: (state) => {
            state.currentUser = null;
            state.error = null;
            state.isLoading = false;
        },

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

        },

        updateUserStart: (state) => {

            state.isLoading = true;
        },

        updateUserSuccess: (state, action) => {

            state.currentUser = action.payload;
            state.isLoading = false;
            state.error = null;
        },

        updateUserFailure: (state, action) =>{
            state.error = action.payload;
            state.isLoading = false
        },

        deleteUserStart : (state) => {
            state.isLoading = true;
        },

        deleteUserSuccess : (state) => {
            state.isLoading = false;
            state.currentUser = null;
            state.error = null;
        },

        deleteUserFaulure : (state, action) => {
            state.isLoading = false;
            state.error = action.payload
        }
    }

});

//automatically generate these thress action 
export const {
    initial,
    signInStart, 
    signInFailure, 
    signInSuccess, 
    updateUserFailure, 
    updateUserSuccess, 
    updateUserStart, 
    deleteUserFaulure,
     deleteUserSuccess, 
     deleteUserStart} = userSlice.actions;

export default userSlice.reducer;
