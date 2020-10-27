import React from "react";
import { Scene } from "./Scene.component";

import * as THREE from "three";
import { PerspectiveCamera, Vector2, Vector3 } from "three";

class HotSpot extends React.Component {
  constructor() {
    super();
    this.sceneRef = React.createRef();

    this.state = {
      isUserInteracting: false,
      onPointerDownMouseX: 0,
      onPointerDownMouseY: 0,
      lon: 0,
      onPointerDownLon: 0,
      lat: 0,
      onPointerDownLat: 0,
      phi: 0,
      theta: 0,
    };
  }

  onPointerMove = (event) => {
    if (event.isPrimary === false) return;
    this.setState({
      lon:
        (this.state.onPointerDownMouseX - event.clientX) * 0.1 +
        this.state.onPointerDownLon,
      lat:
        (event.clientY - this.state.onPointerDownMouseY) * 0.1 +
        this.state.onPointerDownLat,
    });
  };

  onPointerUp = (event) => {
    if (event.isPrimary === false) return;
    this.setState({ isUserInteracting: false });

    this.sceneRef.current.removeEventListener(
      "pointermove",
      this.onPointerMove
    );
    this.sceneRef.current.removeEventListener("pointerup", this.onPointerUp);
  };

  onPointerDown = (event) => {
    if (event.isPrimary === false) return;
    this.setState({
      isUserInteracting: true,
      onPointerDownMouseX: event.clientX,
      onPointerDownMouseY: event.clientY,
      onPointerDownLon: this.state.lon,
      onPointerDownLat: this.state.lat,
    });
    
  };

  onWindowResize = (_camera, _renderer) => {
    _camera.aspect = window.innerWidth / window.innerHeight;
    _camera.updateProjectionMatrix();

    _renderer.setSize(window.innerWidth, window.innerHeight);
  };

  componentDidMount() {
		console.log("Component remounted");
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

    const renderer = new THREE.WebGLRenderer();
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
    var texture = new THREE.TextureLoader().load(
      "http://localhost:5000/projects/image"
    );
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      wireframe: false,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    this.sceneRef.current.appendChild(renderer.domElement);
    this.sceneRef.current.addEventListener(
      "resize",
      this.onWindowResize(camera, renderer)
    );
    const animate = () => {
      requestAnimationFrame(animate);
      if (this.state.isUserInteracting === false) {
        this.setState((prevState) => {
          return { lon: prevState.lon + 0.01 };
        });
			}
			this.setState((prevState) => {
				return (
					{
						lat: Math.max(-85, Math.min(85, prevState.lat)),
						phi: THREE.MathUtils.degToRad(90 - prevState.lat),
						theta : THREE.MathUtils.degToRad(prevState.lon)
					}
				)
			})
			camera.target.x = 500 * Math.sin(this.state.phi) * Math.cos(this.state.theta);
      camera.target.y = 500 * Math.cos(this.state.phi);
			camera.target.z = 500 * Math.sin(this.state.phi) * Math.sin(this.state.theta);
			camera.lookAt(camera.target);
      renderer.render(scene, camera);
    };

    animate();
  }

  render() {
    return (
      <div
        className="HOTPSOT"
        ref={this.sceneRef}
        style={{ minHeight: "120px", backgroundColor: "grey" }}
      >
        {super.obj}
      </div>
    );
  }
}

export default HotSpot;
