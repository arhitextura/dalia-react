import React, { Component } from "react";
import styles from "./hotspot.module.scss";
import * as THREE from "three";
import { ReactComponent as Arrow } from "../../../../icons/arrow_circle_up-24px.svg";
class Hotspot extends Component {
  constructor() {
    super();
    this.domRef = React.createRef();
    this.state = {
      isUserIntercating: false,
      x: 100,
      y: 100,
    };
    this.temp_geometry = new THREE.SphereBufferGeometry(10, 10, 10);
    this.temp_material = new THREE.MeshBasicMaterial({
      color: 0xffffaf,
      wireframe: true,
    });

    this.ball = new THREE.Mesh(this.temp_geometry, this.temp_material);
    this.ball.position.set(50, 0, 100);
  }

  handlePointerDown = (e) => {
    e.stopImmediatePropagation();
    if (e.isPrimary === false) return;
    this.setState(
      { isUserIntercating: true }
    );
    this.domRef.current.addEventListener(
      "pointermove",
      this.handlePointerMove,
      false
    );
    this.domRef.current.addEventListener(
      "pointerup",
      this.handlePointerUp,
      false
    );
  };
  handlePointerMove = (e) => {
    e.stopImmediatePropagation();
    if (this.state.isUserIntercating) {
      this.setState({
        x: e.clientX,
        y: e.clientY,
      });
      
    }
  };
  handlePointerUp = (e) => {
    e.stopImmediatePropagation();
    this.setState({ isUserIntercating: false }
    );
    this.domRef.current.removeEventListener(
      "pointermove",
      this.handlePointerMove,
      false
    );
    this.domRef.current.removeEventListener(
      "pointerup",
      this.handlePointerUp,
      false
    );
  };
  handlePointerLeave = (e) => {
    this.setState({ isUserIntercating: false });
    e.stopImmediatePropagation();
    this.setState({ isUserIntercating: false });
    this.domRef.current.removeEventListener(
      "pointermove",
      this.handlePointerMove,
      false
    );
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
    this.domRef.current.addEventListener(
      "pointerleave",
      this.handlePointerLeave,
      false
    );
    this.props.scene.add(this.ball);
  }
  render() {
    return (
      <div
        className={styles.hotspot}
        style={{
          transform: `translate(-50%,-50%) translate(${this.state.x}px,${this.state.y}px)`,
        }}
        ref={this.domRef}
      >
        <Arrow />
      </div>
    );
  }
}

export default Hotspot;
