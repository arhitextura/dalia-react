import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./scene.module.scss";
import * as THREE from "../../../../THREE/build/three.module";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "../../../../THREE/examples/jsm/renderers/CSS2DRenderer";

import { PerspectiveCamera } from "three";
class Scene extends React.Component {
  constructor() {
    super();
    this.mount = React.createRef();
  }
  componentDidMount() {
    console.log("ref: ", this.mount);
    let scene = new THREE.Scene();
    let camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    // const labelRenderer = new CSS2DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.current.appendChild(renderer.domElement);
    const geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    var texture = new THREE.TextureLoader().load(
      "http://localhost:5000/projects/image"
    );
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const moonDiv = document.createElement("div");
    moonDiv.className = "label";
    moonDiv.textContent = "Label";
    moonDiv.style.marginTop = "-1em";
    const moonLabel = new CSS2DObject(moonDiv);
    moonLabel.position.set(5, 5, 100);
    sphere.add(moonLabel);
    console.log(moonLabel);

    // labelRenderer.setSize(window.innerWidth, window.innerHeight);
    // labelRenderer.domElement.style.position = "absolute";
    // labelRenderer.domElement.style.top = "0px";
    // document.body.appendChild(labelRenderer.domElement);
    var animate = function () {
      requestAnimationFrame(animate);

      //   cube.rotation.x += 0.001;
      sphere.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();
  }

  render() {
    return <div ref={this.mount}></div>;
  }
}

export default Scene;
