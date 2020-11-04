import React, { useRef, useState, useEffect } from "react";
import Hotspot from "../hotpsot/hotspot.component";
import Button from "../button/button.component";
import styles from "./scene.module.scss";

import { useSelector, useDispatch } from "react-redux";
import { addHotspot, changeTexture } from "./sceneSlice";
import { selectHotspots } from "./sceneSlice";

import * as THREE from "three";
import { PerspectiveCamera, Vector2 } from "three";

export default function SceneFunctional() {
  const sceneRef = useRef(null);
  console.log(useSelector((state) => state.scene.hotspots));
  let [hotspots, setHotspots] = useState(useSelector((state) => state.scene.hotspots));

  const dispatch = useDispatch();
  const sceneTexture = useSelector((state) => state.scene.texture);
  

  //START GEOMETRY DECLARATION THREEJS
  const renderer = useRef(new THREE.WebGLRenderer({ antialias: true }));
  const scene = useRef(new THREE.Scene());
  const camera = useRef(
    new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  );
  const geometry = new THREE.SphereBufferGeometry(500, 80, 40);
  geometry.scale(-1, 1, 1);
  let texture = new THREE.TextureLoader().load(sceneTexture);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    wireframe: false,
  });
  geometry.computeBoundingSphere();
  const sphere = useRef(new THREE.Mesh(geometry, material));
  //END GEOMETRY DECLARATION

  //Init scene and event handlers
  useEffect(() => {
    console.log();
    
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    camera.current.target = new THREE.Vector3(0, 0, 0);

    scene.current.add(sphere.current);

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
      camera.current.aspect = window.innerWidth / window.innerHeight;
      camera.current.updateProjectionMatrix();
      renderer.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize, false);
    sceneRef.current.addEventListener("pointerup", onPointerUp, false);
    sceneRef.current.addEventListener("pointerdown", onPointerDown, false);
    renderer.current.domElement.className = styles.canvas;
    sceneRef.current.appendChild(renderer.current.domElement);
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

      camera.current.target.x = 500 * Math.sin(phi) * Math.cos(theta);
      camera.current.target.y = 500 * Math.cos(phi);
      camera.current.target.z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.current.lookAt(camera.current.target);
      renderer.current.render(scene.current, camera.current);
    };
    animate();
    return () => console.log("Cleanup");;
  }, []);


  //Change texture Effect
  useEffect(() => {
    new THREE.TextureLoader().load(sceneTexture, texture => {
      sphere.current.material.map=texture;
      sphere.current.material.needsUpdate = true;
    }, 
    xhr => {
        //Download Progress
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    error => {
      //Error CallBack
      console.log("An error happened" + error);
    }
    );
    
  }, [sceneTexture]);


  const addHotspotToState = () => {
    // const child = (
      // <Hotspot
      //   scene={scene.current}
      //   camera={camera.current}
      //   renderer={renderer.current}
      //   sphere={sphere.current}
      // />
    const child = (
      {x:-110, y:0, z:100}
    );
    setHotspots([...hotspots, child]);
  };

  const changeSceneTexture = (url) => {
    dispatch(changeTexture(url));
  };

  return (
    <div>
      <Button
        onClick={() => {
          // changeSceneTexture(
          //   "https://live.staticflickr.com/65535/48299943976_67f4ae24ea_6k.jpg"
          // )
          addHotspotToState()
        }}
      />
      <div>
        {hotspots.map((elem,i)=>{
          return <Hotspot
            scene={scene.current}
            camera={camera.current}
            renderer={renderer.current}
            sphere={sphere.current}
            key = {`hs-${i}`}
            // initialCoordinates={elem}
          />
        })}
      </div>
      <div ref={sceneRef} className={styles.scene}></div>
    </div>
  );
}
