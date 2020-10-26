import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./scene.module.scss";
import * as THREE from "three";
import RefTest from './reftest'
import {
  CSS2DRenderer,
  CSS2DObject,
} from "../../../../THREE/examples/jsm/renderers/CSS2DRenderer";
import { OrbitControls } from "../../../../THREE/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera, Vector2, Vector3 } from "three";

class Scene extends React.Component {
  constructor() {
    super();
    this.state={}
    this.mount = React.createRef();
    this.scene2d = React.createRef();
    this.pos={};
  }
  
  
  componentDidMount() {
    let scene = new THREE.Scene();
    let camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    let vector = new Vector3();

    camera.target = new THREE.Vector3(0, 0, 0);
    let isUserInteracting = false,
      onPointerDownMouseX = 0,
      onPointerDownMouseY = 0,
      lon = 0,
      onPointerDownLon = 0,
      lat = 0,
      onPointerDownLat = 0,
      phi = 0,
      theta = 0;

    const onPointerMove = (event) => {
      if (event.isPrimary === false) return;
      lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
      lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
    };
    const onPointerUp = (event) => {
      if (event.isPrimary === false) return;

      isUserInteracting = false;

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    const onPointerDown = (event) => {
      if (event.isPrimary === false) return;

      isUserInteracting = true;

      onPointerDownMouseX = event.clientX;
      onPointerDownMouseY = event.clientY;

      onPointerDownLon = lon;
      onPointerDownLat = lat;

      window.addEventListener("pointermove", onPointerMove, false);
      window.addEventListener("pointerup", onPointerUp, false);
    };
    window.addEventListener("pointerdown", onPointerDown, false);

    //RENDER ENGINES
    // 3D Renderer
    const renderer = new THREE.WebGLRenderer();
    const labelRenderer = new CSS2DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.current.appendChild(renderer.domElement);
    //CSS2D Renderer
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    this.scene2d.current.appendChild(labelRenderer.domElement);

    //Geometry
    const geometry = new THREE.SphereBufferGeometry(500, 80, 40);
    geometry.scale(-1, 1, 1);
    var texture = new THREE.TextureLoader().load(
      "http://localhost:5000/projects/image"
    );
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      wireframe: false,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    //Empty Object
    /**
   * 
   * @param {*} obj 
   * @param {*} camera 
   * @param {*} _renderer 
   */
  function toScreenPosition(obj, camera){
    var vector = new THREE.Vector3();

    var widthHalf = 0.5 * renderer.getContext().canvas.width;
    var heightHalf = 0.5 * renderer.getContext().canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = vector.x * widthHalf + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;
    console.log(`X: ${vector.x} - X: ${vector.y}`)
    this.setState({posX:vector.x, posY:vector.y})
    return {
      x: vector.x,
      y: vector.y,
    };
  }
    const obj = new THREE.Object3D();
    obj.name = "LabelHolder";
    obj.position.set(10,0,0)
    scene.add(obj);
    //Label
    const moonDiv = document.createElement("div");
    moonDiv.className = "label";
    moonDiv.textContent = "Label";
    moonDiv.style.marginTop = "-1em";
    moonDiv.style.color = "#DDD";
    const moonLabel = new CSS2DObject(moonDiv);
    moonLabel.position.set(1, 1, 1);
    sphere.add(moonLabel);

    const animate = function () {
      requestAnimationFrame(animate);

      if (isUserInteracting === false) {
        lon += 0.01;
      }

      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
      camera.target.y = 500 * Math.cos(phi);
      camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
      moonLabel.position.set(1, 1, 1);
      camera.lookAt(camera.target);

      toScreenPosition(obj, camera);
      

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };

    animate();
  }

  render() {
    return (
      <div>
        <RefTest x={this.state.posX} y={this.state.posY}></RefTest>
        <div className={styles.scene3d} ref={this.mount}></div>
        <div className={styles.scene2d} ref={this.scene2d}></div>
      </div>
    );
  }
}

export default Scene;
