
import { createSlice } from '@reduxjs/toolkit';
import { act } from 'react-dom/test-utils';

export const sceneSlice = createSlice({
    name: 'scene',
    initialState: {
      hotspots: [{x:484, y:-42, z:113}],
      texture:"https://cdn.eso.org/images/publicationjpg/vlt-mw-potw-cc-extended.jpg"
      
    },
    reducers: {
      increment: state => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        state.value += 1;
      },
      decrement: state => {
        state.value -= 1;
      },
      addHotspot: (state, action) => {
        state.hotspots = [...state.hotspots, action.payload];
      },
      changeTexture:(state, action) => {
        state.texture = action.payload
      }
    },
  });
  
  export const { increment, decrement, addHotspot, changeTexture } = sceneSlice.actions;
  
  // The function below is called a thunk and allows us to perform async logic. It
  // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
  // will call the thunk with the `dispatch` function as the first argument. Async
  // code can then be executed and other actions can be dispatched

  
  // The function below is called a selector and allows us to select a value from
  // the state. Selectors can also be defined inline where they're used instead of
  // in the slice file. For example: `useSelector((state) => state.counter.value)`
  export const selectHotspots = state => state.scene.hotspots;
  // export const sceneTexture = state => state.scene.texture;
  
  export default sceneSlice.reducer;
  