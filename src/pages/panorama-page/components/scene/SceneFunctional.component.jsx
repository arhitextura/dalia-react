import React, { useRef, useState, useEffect } from "react";
import Hotspot from "../hotpsot/hotspot.component";
import Button from '../button/button.component'
import styles from "./scene.module.scss";

import { useSelector, useDispatch } from 'react-redux';
import { addHotspot } from './sceneSlice'
import {selectHotspots} from './sceneSlice'

import * as THREE from "three";
import { PerspectiveCamera, Vector2 } from "three";

export default function SceneFunctional() {
  const sceneRef = useRef(null);
  const dispatch = useDispatch()
  const stateHs = useSelector(selectHotspots)
  let [hotspots, setHotspots] = useState([]);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  const scene = new THREE.Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.target = new THREE.Vector3(0, 0, 0);
  const geometry = new THREE.SphereBufferGeometry(500, 80, 40);
  geometry.scale(-1, 1, 1);
  let texture = new THREE.TextureLoader().load(
    "https://cdn.eso.org/images/publicationjpg/vlt-mw-potw-cc-extended.jpg"
  );
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    wireframe: false,
  });
  geometry.computeBoundingSphere();
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  let isUserInteracting = false;
  let onPointerDownMouseX = 0;
  let onPointerDownMouseY = 0;
  let lon = 0;
  let onPointerDownLon = 0;
  let lat = 0;
  let onPointerDownLat = 0;
  let phi = 0;
  let theta = 0;

  const onPointerMove = (event) => {
    if (event.isPrimary === false) return;
    lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
    lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
  };
  const onPointerUp = (event) => {
    if (event.isPrimary === false) return;
    isUserInteracting = false;
    sceneRef.current.removeEventListener("pointermove", onPointerMove);
    sceneRef.current.removeEventListener("pointerup", onPointerUp);
    sceneRef.current.removeEventListener("pointermove", onPointerMove);
  };

  const onPointerDown = (event) => {
    if (event.isPrimary === false) return;
    isUserInteracting = true;
    onPointerDownMouseX = event.clientX;
    onPointerDownMouseY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
    sceneRef.current.addEventListener("pointermove", onPointerMove, false);
    sceneRef.current.addEventListener("pointerup", onPointerUp, false);
    sceneRef.current.addEventListener("pointerdown", onPointerDown, false);
  };

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  useEffect(() => {
    console.log("MOUNTED");
    window.onresize = onWindowResize;
    sceneRef.current.addEventListener("pointerup", onPointerUp, false);
    sceneRef.current.addEventListener("pointerdown", onPointerDown, false);
    renderer.domElement.className = styles.canvas;
    sceneRef.current.appendChild(renderer.domElement);
    let mouse = new Vector2(0.0, 0.0);
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove, false);
    const animate = () => {
      requestAnimationFrame(animate);
      if (isUserInteracting === false) {
        lon = lon + 0.01;
      }
      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
      camera.target.y = 500 * Math.cos(phi);
      camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

      
      camera.lookAt(camera.target);
      renderer.render(scene, camera);
    };
    animate();
  }, []);
  useEffect(() => {
    console.log("State hotspots:", stateHs);
    // const child = (
    //   <Hotspot
    //     scene={scene}
    //     camera={camera}
    //     renderer={renderer}
    //     sphere={sphere}
    //     key={5}
    //   />
    // );
    setHotspots(([]));
  }, []);
  
  const addHotspotToState = () => {
    const child = (
      <Hotspot
        scene={scene}
        camera={camera}
        renderer={renderer}
        sphere={sphere}
      />
    );
    setHotspots ([...hotspots, child])
    // dispatch(addHotspot(child))
    // console.log(hotspots);
  }
  


  return (
    <div>
      <Button onClick = {addHotspotToState}/>
      <div>{hotspots}</div>  
      <div ref={sceneRef} className={styles.scene}>
      </div>
    </div>
  );
}
