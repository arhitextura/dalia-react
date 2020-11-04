import React, { useEffect } from "react";
import styles from './panorama.module.scss'
//Components
import Scene from "./components/scene/Scene.component";
import SmallButton from "./components/small-button/small-button.component";

import { useSelector, useDispatch } from "react-redux";
import { fetchImages } from "./panoramaSlice";

export default function Panorama() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.projects.status);

  // useEffect(() => {
  //   if (status === "idle") {
  //     dispatch(fetchImages());
  //   }
  // }, [status, dispatch]);

  return (
    <div className={styles.panorama_page}>
      <Scene name={"ID01"} id={"SOL0000"} />
    </div>
  );
}
