import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import projectsReducer from '../pages/panorama-page/panoramaSlice'
import sceneReducer from '../pages/panorama-page/components/scene/sceneSlice'
export default configureStore({
  reducer: {
    counter: counterReducer,
    projects: projectsReducer,
    scene: sceneReducer
  },
});
