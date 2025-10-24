import { configureStore } from "@reduxjs/toolkit";
import loadersReducer from "./loaderSlice";
import userReducer from "./userSlice";

const store = configureStore({
    reducer: {
        loader: loadersReducer,
        user: userReducer,
    },
});

export default store;