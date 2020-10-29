import React from "react";
import Hotspot from "../hotpsot/hotspot.component";
import styles from "./scene.module.scss";
import * as THREE from "three";
import { PerspectiveCamera, Raycaster, Vector2, Vector3 } from "three";
import { to3DPosition, normalizeMouseCoordinates } from "./utils";
class Scene extends React.Component {
  // To be renamed to Scene.component.jsx
  constructor() {
    super();
    this.state = {
      hotSpots: [],
    };
    this.sceneRef = React.createRef();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene = new THREE.Scene();
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.target = new THREE.Vector3(0, 0, 0);
    this.geometry = new THREE.SphereBufferGeometry(500, 80, 40);
    this.geometry.scale(-1, 1, 1);
    let texture = new THREE.TextureLoader().load(
      "http://localhost:5000/projects/image"
    );
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      wireframe: true,
    });
    this.geometry.computeBoundingSphere();
    this.sphere = new THREE.Mesh(this.geometry, material);
    this.scene.add(this.sphere);
    this.isUserInteracting = false;
    this.onPointerDownMouseX = 0;
    this.onPointerDownMouseY = 0;
    this.lon = 0;
    this.onPointerDownLon = 0;
    this.lat = 0;
    this.onPointerDownLat = 0;
    this.phi = 0;
    this.theta = 0;
    this.children = [];
  }

  onPointerDoubleClick = (event) => {
    if (event.isPrimary === false) return;
    const Child = React.cloneElement(<Hotspot />, {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      sphere: this.sphere,
    });
    this.setState(
      (prevState) => {
        prevState.hotSpots.push(Child);
        return { hotSpots: [...prevState.hotSpots] };
      },
      () => console.log(this.state)
    );
    // this.children.push(child);
    console.log("Double Clicked");
  };

  onPointerMove = (event) => {
    if (event.isPrimary === false) return;
    this.lon =
      (this.onPointerDownMouseX - event.clientX) * 0.1 + this.onPointerDownLon;
    this.lat =
      (event.clientY - this.onPointerDownMouseY) * 0.1 + this.onPointerDownLat;
  };

  onPointerUp = (event) => {
    if (event.isPrimary === false) return;
    this.isUserInteracting = false;
    console.log("ClientY", event.clientY);
    console.log("getBoundingRect", this.renderer.domElement.getBoundingClientRect());
;
    this.sceneRef.current.removeEventListener(
      "pointermove",
      this.onPointerMove
    );
    this.sceneRef.current.removeEventListener("pointerup", this.onPointerUp);
    this.sceneRef.current.removeEventListener(
      "pointermove",
      this.onPointerMove
    );
  };

  onPointerDown = (event) => {
    if (event.isPrimary === false) return;
    this.isUserInteracting = true;
    this.onPointerDownMouseX = event.clientX;
    this.onPointerDownMouseY = event.clientY;
    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;
    this.sceneRef.current.addEventListener(
      "pointermove",
      this.onPointerMove,
      false
    );
    this.sceneRef.current.addEventListener(
      "pointerup",
      this.onPointerUp,
      false
    );
    this.sceneRef.current.addEventListener(
      "pointerdown",
      this.onPointerDown,
      false
    );
  };

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  componentDidMount() {
    console.log("Rendered");
    window.onresize = this.onWindowResize;
    this.sceneRef.current.addEventListener(
      "pointerup",
      this.onPointerUp,
      false
    );
    this.sceneRef.current.addEventListener(
      "pointerdown",
      this.onPointerDown,
      false
    );
    this.sceneRef.current.addEventListener(
      "dblclick",
      this.onPointerDoubleClick,
      false
    );

    this.renderer.domElement.className = styles.canvas;
    this.sceneRef.current.appendChild(this.renderer.domElement);

    let ray = new THREE.Raycaster();
    let mouse = new Vector2();

    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove, false);
    const animate = () => {
      requestAnimationFrame(animate);

      if (this.isUserInteracting === false) {
        this.lon = this.lon + 0.01;
      }

      this.lat = Math.max(-85, Math.min(85, this.lat));
      this.phi = THREE.MathUtils.degToRad(90 - this.lat);
      this.theta = THREE.MathUtils.degToRad(this.lon);

      this.camera.target.x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
      this.camera.target.y = 500 * Math.cos(this.phi);
      this.camera.target.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);
      this.camera.lookAt(this.camera.target);
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
  render() {
    return (
      <div className={styles.scene} ref={this.sceneRef}>
        <Hotspot
          scene={this.scene}
          camera={this.camera}
          renderer={this.renderer}
          sphere={this.sphere}
        ></Hotspot>
        
        {this.state.hotSpots.map((child, i) => {
          return (
            <Hotspot
              scene={this.scene}
              camera={this.camera}
              renderer={this.renderer}
              sphere={this.sphere}
              key={i}
            />
          );
        })}
      </div>
    );
  }
}

export default Scene;
