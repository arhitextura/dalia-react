import React, { Component, useState, useEffect, useRef } from "react";
import styles from "./hotspot.module.scss";
import {
  normalizeMouseVector,
  toScreenPosition,
  to3DPosition,
  dragElement,
} from "./hotspotUtils";
import * as THREE from "three";
import { Vector2 } from "three";
import { ReactComponent as Arrow } from "../../../../icons/arrow_circle_up-24px.svg";
import { ReactComponent as Close } from "../../../../icons/highlight_off-24px.svg";
import { ReactComponent as Rotate } from "../../../../icons/rotate-24px.svg";
import { ReactComponent as SceneList } from "../../../../icons/view_list-24px.svg";

import SmallButton from "../small-button/small-button.component";
import List from "../list/list.component";

export default function Hotspot(props) {
  const domRef = useRef(null);
  let isDraggable = useRef(
    process.env.NODE_ENV === "development" ? true : false
  );

  let geometry = new THREE.SphereBufferGeometry(10, 10, 10);
  let material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
  });
  let anchor = useRef(new THREE.Mesh(geometry, material));
  // let anchor = useRef(new THREE.Object3D());
  // if(props.initialCoordinates){
  //   console.log("You can set here the position of the object");
  //   const {initX, initY, initZ} = props.initialCoordinates;
  //   anchor.current.position.set(initX, initY, initZ)
  // }

  useEffect(() => {
    anchor.current.position.set(400, 0, 0);
    let hsRect = domRef.current.getBoundingClientRect();
    let containerRect = props.renderer.domElement.getBoundingClientRect();
    let relMouse = new Vector2(0.0, 0.0);
    let windowMouse = new Vector2(0.0, 0.0);
    let realMouse = new Vector2(0.0, 0.0)
    let isUserInteracting = false;

    // Event - Pointer down
    const handlePointerDown = (e) => {
      if (e.isPrimary === false) return;
      e.stopImmediatePropagation();
      e.preventDefault();
      isUserInteracting = true;
      hsRect = domRef.current.getBoundingClientRect();
      relMouse.set(e.pageX - hsRect.x, e.pageY - hsRect.y);
      windowMouse.set(e.clientX - relMouse.x, e.clientY - relMouse.y);
      relMouse.set(e.pageX - hsRect.x, e.pageY - hsRect.y);

      //Adding events
      window.addEventListener("pointermove", handlePointerMove, false);
      domRef.current.addEventListener("pointerup", handlePointerUp, false);
    };

    //Event - Pointer move
    const handlePointerMove = (e) => {
      e.preventDefault();
      hsRect = domRef.current.getBoundingClientRect();
      containerRect = props.renderer.domElement.getBoundingClientRect();
      windowMouse.set(e.clientX - relMouse.x, e.clientY - relMouse.y);
      to3DPosition(
        anchor.current,
        normalizeMouseVector((new Vector2(e.clientX, e.clientY)), props.renderer.domElement),
        props.camera,
        props.sphere,
        props.renderer
      );
      console.log(normalizeMouseVector((new Vector2(e.clientX, e.clientY+containerRect.top)), props.renderer.domElement));
    };

    //Event - Pointer up
    const handlePointerUp = (e) => {
      e.stopImmediatePropagation();
      e.preventDefault();
      isUserInteracting = false;
      containerRect = props.renderer.domElement.getBoundingClientRect();
      hsRect = domRef.current.getBoundingClientRect();
      relMouse.set(e.pageX - hsRect.x, e.pageY - hsRect.y);
      windowMouse.set(e.clientX - relMouse.x, e.clientY - relMouse.y);
      

      //Remove eventHandlers
      window.removeEventListener("pointermove", handlePointerMove, false);
      domRef.current.removeEventListener("pointerup", handlePointerUp, false);
    };

    const handleScroll = (e) => {
      containerRect = props.renderer.domElement.getBoundingClientRect();
      hsRect = domRef.current.getBoundingClientRect();
      console.log(hsRect.y)
    };
    domRef.current.addEventListener("pointerdown", handlePointerDown, false);
    window.addEventListener("scroll", handleScroll, false);

    props.scene.add(anchor.current);
    // dragElement(domRef.current, anchor.current, props.camera, props.sphere, props.renderer.domElement)

    const update = () => {
      requestAnimationFrame(update);
      if (isUserInteracting) {
        domRef.current.style.transform = `translate(${
          windowMouse.x - containerRect.x + window.pageXOffset
        }px,${windowMouse.y - containerRect.y + window.pageYOffset}px)`;
      } else {
        const screenCoords = toScreenPosition(
          anchor.current,
          props.camera,
          props.renderer,
          props.scene
        );
        // console.log(screenCoords);
        domRef.current.style.transform = `translate(
        ${screenCoords.x}px,
        ${screenCoords.y}px)`;
        domRef.current.style.display = screenCoords.visibility;
        // domRef.current.style = '';
      }
    };
    update();
    return () => {
      console.log("cleanup function");
    };
  }, []);

  return <div className={`${styles.hotspot}`} ref={domRef}></div>;
}
