import React, { Component, useState, useEffect, useRef } from "react";
import styles from "./hotspot.module.scss";

import * as THREE from "three";
import { Vector2 } from "three";
import { ReactComponent as Arrow } from "../../../../icons/arrow_circle_up-24px.svg";
import { ReactComponent as Close } from "../../../../icons/highlight_off-24px.svg";
import { ReactComponent as Rotate } from "../../../../icons/rotate-24px.svg";
import { ReactComponent as SceneList } from "../../../../icons/view_list-24px.svg";

import SmallButton from "../small-button/small-button.component";
import List from '../list/list.component'
import {
  toScreenPosition,
  to3DPosition,
  normalizeMouseCoordinates,
} from "../scene/utils";


/**
 * 
 * @param {Object} props.initialCoordinates - Saved coordinates to scene state 
 * @param {Object} props.URL - Picture URL to load when clicked
 */
export default function Hotspot(props) {
  const domRef = useRef(null);
  let isDraggable = useRef(
    process.env.NODE_ENV === "development" ? true : false
  );
  let geometry = new THREE.SphereBufferGeometry(10,10,10);  
  let material = new THREE.MeshBasicMaterial({
    color:0xff0000
  })
  let anchor = useRef(new THREE.Mesh(geometry, material));
  // let anchor = useRef(new THREE.Object3D());
  if(props.initialCoordinates){
    console.log("You can set here the position of the object");
    const {initX, initY, initZ} = props.initialCoordinates;
    anchor.current.position.set(initX, initY, initZ)
  }
  let [rotation, setRotation] = useState(0);
  
  
  useEffect(() => {
    
    let isUserInteracting = false;
    let mousePosition = new Vector2(0.0, 0.0);
    to3DPosition(
      anchor.current,
      mousePosition,
      props.camera,
      props.sphere,
      props.renderer
    );

    //Event - Pointer down
    const handlePointerDown = (e) => {
      e.stopImmediatePropagation();
      e.preventDefault();
      if (e.isPrimary === false) return;
      if (isDraggable.current) {
        domRef.current.classList.add(styles.grabbing);
        isUserInteracting = true;
      } else {
        return;
      }
      window.addEventListener("pointermove", handlePointerMove, false);
      domRef.current.addEventListener("pointerup", handlePointerUp, false);
    };

    //Event - Pointer move
    const handlePointerMove = (e) => {
      e.preventDefault();
      if (isUserInteracting) {
        const x =
          e.clientX - props.renderer.domElement.getBoundingClientRect().left;
        const y =
          e.clientY - props.renderer.domElement.getBoundingClientRect().top;
        mousePosition.set(x, y);
      }
    };

    //Event - Pointer up
    const handlePointerUp = (e) => {
      e.stopImmediatePropagation();
      e.preventDefault();
      isUserInteracting = false;
      domRef.current.classList.remove(styles.grabbing);
      mousePosition.copy(
        normalizeMouseCoordinates(mousePosition, props.renderer)
      );

      to3DPosition(
        anchor.current,
        mousePosition,
        props.camera,
        props.sphere,
        props.renderer
      );
      window.removeEventListener("pointermove", handlePointerMove, false);
      domRef.current.removeEventListener("pointerup", handlePointerUp, false);
    };
    domRef.current.addEventListener("pointerdown", handlePointerDown, false);
    props.scene.add(anchor.current);

    const update = () => {
      requestAnimationFrame(update);
      if (isUserInteracting) {
        // domRef.current.style.transform = `translate(-50%,-50%) translate(${mousePosition.x}px,${mousePosition.y}px)`;
        domRef.current.style.transform = `translate(${mousePosition.x}px,${mousePosition.y}px)`;
      } else {
        const { posX, posY, visibility } = toScreenPosition(
          anchor.current,
          props.camera,
          props.renderer,
          props.scene
        );
        const rect = domRef.current.getBoundingClientRect()
        mousePosition.set(posX, posY);
        // domRef.current.style.transform = `translate(-50%,-50%) translate(${posX}px,${posY}px)`;
        domRef.current.style.transform = `translate(${posX-rect.width/2}px,${posY-rect.height/2}px)`;
        domRef.current.style.display = visibility;
      }
    };
    update();
    return () => {
      console.log("cleanup function");
    };
  }, []);
const logSomething = ()=>{
  console.log("Click  still working");
}
  return (
    <div
      className={`${styles.hotspot} ${isDraggable.current ? styles.grab : ""}`}
      ref={domRef}
    >
      <div>
        <SmallButton icon={<Close className={styles.close_button} />}/>
          
        <SmallButton icon = {<Rotate className={styles.rotate_button} />}/>
          
      </div>
      <Arrow
        className={styles.arrow}
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      <div>
        <SmallButton.WithToggle icon = {<SceneList className={styles.scene_list} /> } >
          <List>
            <List.Item>
              Scene 01
            </List.Item>
          </List>
        </SmallButton.WithToggle>
      </div>
    </div>
  );
}
