
import { configureStore } from "@reduxjs/toolkit"
import { shoesSlice } from "./shoesSlice";
const store = configureStore({
    reducer:{
        shoes: shoesSlice.reducer,
    }
})

export default store;