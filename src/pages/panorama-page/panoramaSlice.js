import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import initialState from './initialState.js'

//Here we will fetch the API
export const fetchImages = createAsyncThunk("images/fetchImages", async () => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/photos")
  return res.data
})
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
    addProject: (state, action) =>{
      state.projects = [...state.projects, action.payload]
    }
    
  },
  extraReducers: {
    [fetchImages.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchImages.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      //Add the fetched data to the state
      state.image = state.image.concat(action.payload)
    },
    [fetchImages.rejected]: (state, action) => {
      state.status = "failed"
      state.error = action.error.message
    }
  }
})

export const {
  increment,
  decrement,
  incrementByAmount,
} = panoramaSlice.actions;

export default panoramaSlice.reducer;
