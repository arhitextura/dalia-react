import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import initialState from './initialState.js'

//Here we will fetch the API
export const fetchImages = createAsyncThunk("images/fetchImages", async () => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/photos")
  return res.data
})
export const panoramaSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
      
    addProject: (state, action) =>{
      state.projects = [...state.projects, action.payload]
    },
    
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
  getImage
} = panoramaSlice.actions;

export default panoramaSlice.reducer;
