import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./scene.module.scss";
import * as THREE from "three";
import RefTest from "./reftest";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
// import { OrbitControls } from "../../../../THREE/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera, Vector2, Vector3 } from "three";

export default class Scene extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.mount = React.createRef();
    this.scene2d = React.createRef();
    this.obj = new THREE.Object3D();
  }

  componentDidMount() {
    console.log("Updates");
    let scene = new THREE.Scene();
    let camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

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
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("pointerdown", onPointerDown, false);
    window.addEventListener("resize", onWindowResize, false);
    //RENDER ENGINES
    // 3D Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.current.appendChild(renderer.domElement);
    // const renderer = new THREE.WebGLRenderer();
    //CSS2D Renderer
    const labelRenderer = new CSS2DRenderer();
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

    //Empty OBJECT
    const objGeometry = new THREE.SphereBufferGeometry(0.5, 15, 15);
    const objMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: false,
    });
    const obj = new THREE.Mesh(objGeometry, objMaterial);
    obj.name = "LabelHolder";
    obj.position.set(-10, 0, 10);
    scene.add(obj);

    const toScreenPosition = (obj, camera) => {
      let { x, y, z } = obj.position;
      var objVector = new THREE.Vector3(x, y, z);

      var widthHalf = 0.5 * renderer.getContext().canvas.width;
      var heightHalf = 0.5 * renderer.getContext().canvas.height;

      if (scene.autoUpdate === true) scene.updateMatrixWorld();
      if (camera.parent === null) camera.updateMatrixWorld();
      let vector = objVector.project(camera);
      const isVisible =
        obj.visible && vector.z >= -1 && vector.z <= 1 ? "" : "none";

      vector.x = vector.x * widthHalf + widthHalf;
      vector.y = -vector.y * heightHalf + heightHalf;
      // console.log(`X: ${vector.x} ==== Y:${vector.y}`);
      this.setState({ posX: vector.x, posY: vector.y, visibility: isVisible });
    };

    //Label for debug
    const moonDiv = document.createElement("div");
    moonDiv.className = "label";
    moonDiv.textContent = "Label moon";
    moonDiv.style.marginTop = "-1em";
    moonDiv.style.color = "#DDD";
    const moonLabel = new CSS2DObject(moonDiv);
    
    console.log(moonLabel.position);
    sphere.add(moonLabel);

    const animate = function () {
      requestAnimationFrame(animate);
      toScreenPosition(obj, camera);

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

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };

    animate();
  }

  render() {
    return (
      <div>
        <RefTest
          x={this.state.posX}
          y={this.state.posY}
          visibility={this.state.visibility}
        ></RefTest>
        <div className={styles.scene3d} ref={this.mount}></div>
        <div className={styles.scene2d} ref={this.scene2d}></div>
      </div>
    );
  }
}

