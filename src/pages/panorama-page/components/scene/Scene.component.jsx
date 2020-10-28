import React from "react";
import Hotspot from "../hotpsot/hotspot.component";
import styles from "./scene.module.scss";
import * as THREE from "three";
import { PerspectiveCamera, Raycaster, Vector2, Vector3 } from "three";

class Scene extends React.Component {
  // To be renamed to Scene.component.jsx
  constructor() {
    super();
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

    this.isUserInteracting = false;
    this.onPointerDownMouseX = 0;
    this.onPointerDownMouseY = 0;
    this.lon = 0;
    this.onPointerDownLon = 0;
    this.lat = 0;
    this.onPointerDownLat = 0;
    this.phi = 0;
    this.theta = 0;
  }

  onPointerMove = (event) => {
    if (event.isPrimary === false) return;
      this.lon = (this.onPointerDownMouseX - event.clientX) * 0.1 + this.onPointerDownLon
      this.lat = (event.clientY - this.onPointerDownMouseY) * 0.1 + this.onPointerDownLat

  }

  onPointerUp = (event) => {
    if (event.isPrimary === false) return;
    this.isUserInteracting = false

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
    this.isUserInteracting = true
    this.onPointerDownMouseX = event.clientX
    this.onPointerDownMouseY = event.clientY
    this.onPointerDownLon = this.lon
    this.onPointerDownLat = this.lat
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

    const geometry = new THREE.SphereBufferGeometry(500, 80, 40);
    geometry.scale(-1, 1, 1);
    var texture = new THREE.TextureLoader().load(
      "http://localhost:5000/projects/image"
    );
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      wireframe: true,
    });
    geometry.computeBoundingSphere();
    const sphere = new THREE.Mesh(geometry, material);
    console.log(sphere);
    this.scene.add(sphere);

    const temp_geometry = new THREE.SphereBufferGeometry(10, 10, 10);
    const temp_material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });
    const ball = new THREE.Mesh(temp_geometry, temp_material);
    ball.position.set(10, 0, 100);
    this.scene.add(ball);
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
      // ray.setFromCamera(mouse, this.camera)
      // let intersects = ray.intersectObject(sphere)
      // if (intersects.length > 0 ) {
      //   ball.position.set(0,0,0);
      //   ball.position.copy(intersects[0].point)
      // }

      if (this.isUserInteracting === false) {
        this.lon = this.lon + 0.01 
      }
      
      this.lat= Math.max(-85, Math.min(85, this.lat))
      this.phi= THREE.MathUtils.degToRad(90 - this.lat)
      this.theta= THREE.MathUtils.degToRad(this.lon)
        
      this.camera.target.x =
        500 * Math.sin(this.phi) * Math.cos(this.theta);
      this.camera.target.y = 500 * Math.cos(this.phi);
      this.camera.target.z =
        500 * Math.sin(this.phi) * Math.sin(this.theta);
      this.camera.lookAt(this.camera.target);
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
  render() {
    return (
      <div className={styles.scene} ref={this.sceneRef}>
        <Hotspot scene={this.scene} camera = {this.camera}  renderer = {this.renderer} ></Hotspot>
      </div>
    );
  }
}

export default Scene;
