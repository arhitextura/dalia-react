import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  image: "",
  status: "idle",
  error: null,
}; //Here we will call the API
export const fetchImages = createAsyncThunk("images/dir", async () => {
  console.log("fetchpost was dispatched");
  fetch("http://localhost:5000/images/dir")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("Data:", data);
      return data;
    })
    .catch((err) => console.log(err));
});
export const panoramaSlice = createSlice({
  name: "panorama",
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    getImage: (state) => {
      state.image =
        "Here we need an image path to load it with the pano package";
    },
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
} = panoramaSlice.actions;

export default panoramaSlice.reducer;
