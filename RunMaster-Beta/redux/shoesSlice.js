import { createSlice } from "@reduxjs/toolkit";

export const shoesSlice = createSlice({
  name: "shoes",
  initialState: {
    usingShoe: {
        nft_id:-1
    },
    myShoesList: [],
  },
  reducers: {
    usingShoeChange: (state, action) => {
      state.usingShoe = action.payload;
    },
    myShoesListChange: (state, action) => {
      state.myShoesList = action.payload;
    },
  },
});
