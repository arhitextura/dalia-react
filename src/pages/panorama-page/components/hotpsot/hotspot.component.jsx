import React, { Component } from "react";
import styles from "./hotspot.module.scss";
import * as THREE from "three";
import { ReactComponent as Arrow } from "../../../../icons/arrow_circle_up-24px.svg";

const toScreenPosition = (obj, _camera, _renderer, _scene) => {
  let { x, y, z } = obj.position;
  var objVector = new THREE.Vector3(x, y, z);

  var widthHalf = 0.5 * _renderer.getContext().canvas.width;
  var heightHalf = 0.5 * _renderer.getContext().canvas.height;

  if (_scene.autoUpdate === true) _scene.updateMatrixWorld();
  if (_camera.parent === null) _camera.updateMatrixWorld();
  let vector = objVector.project(_camera);
  const isVisible =
    obj.visible && vector.z >= -1 && vector.z <= 1 ? "" : "none";

  vector.x = vector.x * widthHalf + widthHalf;
  vector.y = -vector.y * heightHalf + heightHalf;
  // console.log(`X: ${vector.x} ==== Y:${vector.y}`);
  return { posX: vector.x, posY: vector.y, visibility: isVisible };
};

class Hotspot extends Component {
  constructor() {
    super();
    this.domRef = React.createRef();
    // this.state = {
    //   isUserIntercating: false,
    //   x: 100,
    //   y: 100,
    // };
    this.temp_geometry = new THREE.SphereBufferGeometry(10, 10, 10);
    this.temp_material = new THREE.MeshBasicMaterial({
      color: 0xffffaf,
      wireframe: true,
    });

    this.ball = new THREE.Mesh(this.temp_geometry, this.temp_material);
    this.ball.name = "UniqueName";
    this.ball.position.set(50, 0, 100);
    this.isUserIntercating = false;
    this.position = {
      x: 100,
      y: 100,
    };
  }

  handlePointerDown = (e) => {
    e.stopImmediatePropagation();
    if (e.isPrimary === false) return;
    this.isUserIntercating = true;
    window.addEventListener("pointermove", this.handlePointerMove, false);
    this.domRef.current.addEventListener(
      "pointerup",
      this.handlePointerUp,
      false
    );
  };
  handlePointerMove = (e) => {
    if (this.isUserIntercating) {
      this.position = {
        x: e.clientX,
        y: e.clientY,
      };
    }
  };
  handlePointerUp = (e) => {
    this.isUserIntercating = false;
    window.removeEventListener("pointermove", this.handlePointerMove, false);
    this.domRef.current.removeEventListener(
      "pointerup",
      this.handlePointerUp,
      false
    );
  };

  componentDidMount() {
    this.domRef.current.addEventListener(
      "pointerdown",
      this.handlePointerDown,
      false
    );
    this.props.scene.add(this.ball);
    const update = () => {
      requestAnimationFrame(update);
      if (this.isUserIntercating) {
        this.domRef.current.style.transform = `translate(-50%,-50%) translate(${this.position.x}px,${this.position.y}px)`;
      } else {
        const { posX, posY, visibility } = toScreenPosition(
          this.ball,
          this.props.camera,
          this.props.renderer,
          this.props.scene
        );
        this.position.x = posX;
        this.position.y = posY;

        this.domRef.current.style.transform = `translate(-50%,-50%) translate(${this.position.x}px,${this.position.y}px)`;
        this.domRef.current.style.display = visibility;
      }
    };
    update();
  }
  render() {
    return (
      <div
        className={styles.hotspot}
        style={{
          transform: `translate(-50%,-50%) translate(${this.position.x}px,${this.position.y}px)`,
        }}
        ref={this.domRef}
      >
        <Arrow />
      </div>
    );
  }
}

export default Hotspot;
