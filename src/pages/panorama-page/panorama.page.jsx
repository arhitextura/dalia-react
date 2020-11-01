import React, { useEffect } from "react";
import Menu from "./components/table-menu/menu.component";
import Scene from './components/scene/Scene.component'
import SceneFunctional from './components/scene/SceneFunctional.component'
import { useSelector, useDispatch } from "react-redux";
import { fetchImages } from "./panoramaSlice";


export default function Panorama() {
  
  const dispatch = useDispatch();
  const status = useSelector((state) => state.panorama.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchImages());
    }
  }, [status, dispatch]);


  return (
    <div>

      {/* <Scene/> */}
    <SceneFunctional/>
      <Menu />
      
    </div>
  );
}
