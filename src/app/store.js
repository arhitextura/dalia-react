import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import panoramaReducer from '../pages/panorama-page/panoramaSlice'
export default configureStore({
  reducer: {
    counter: counterReducer,
    panorama: panoramaReducer
  },
});
