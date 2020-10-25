import React, { useEffect } from "react";
import Menu from "./components/table-menu/menu.component";

import { useSelector, useDispatch } from "react-redux";
import { fetchImages } from "./panoramaSlice";
export default function Panorama() {
  const images = useSelector((state) => state.panorama); //This will set a fake state from store.panorama
  const dispatch = useDispatch();
  const status = useSelector((state) => state.panorama.status);

  useEffect(() => {
    if (status === "idle") {
      // console.log([fetchImages.fulfilled])
      dispatch(fetchImages());
    }
  }, [status, dispatch]);
  return (
    <div>
      <Menu />
    </div>
  );
}