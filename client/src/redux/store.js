import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer, persistStore  } from "redux-persist";
import storage from 'redux-persist/lib/storage'


//set up redux presist
const rootReducer = combineReducers({ user: userReducer }); // <-<---import rootReducer from './reducers'

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistorReducer = persistReducer(persistConfig, rootReducer); //to store the info

export const store = configureStore({
  //reducer: { user: userReducer }, 
  reducer: persistorReducer, // this is will be call from selector later
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);