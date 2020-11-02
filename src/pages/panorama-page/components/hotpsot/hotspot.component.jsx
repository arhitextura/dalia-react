import React, { Component } from "react";
import styles from "./hotspot.module.scss";

import * as THREE from "three";
import { Vector2 } from "three";
import { ReactComponent as Arrow } from "../../../../icons/arrow_circle_up-24px.svg";
import { ReactComponent as Close } from "../../../../icons/highlight_off-24px.svg";
import { ReactComponent as Rotate } from "../../../../icons/rotate-24px.svg";
import { ReactComponent as SceneList } from "../../../../icons/view_list-24px.svg";
import SmallButton from "../small-button/small-button.component";
import {
  toScreenPosition,
  to3DPosition,
  normalizeMouseCoordinates,
} from "../scene/utils";

class Hotspot extends Component {
  constructor(props) {
    super(props);
    this.domRef = React.createRef();
    this.anchor = new THREE.Object3D();
    // this.anchor.position.set(200, 0, 100);
    this.isUserIntercating = false;
    this.isDraggable = process.env.NODE_ENV === "development" ? true : false;
    this.state = {
      rotation: 0,
    };
    console.log(this.props.scene.uuid);
    this.mousePosition = new Vector2(0.0, 0.0);
    to3DPosition(
      this.anchor,
      this.mousePosition,
      this.props.camera,
      this.props.sphere,
      this.props.renderer
    );
  }

  handlePointerDown = (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();
    if (e.isPrimary === false) return;
    if (this.isDraggable) {
      this.domRef.current.classList.add(styles.grabbing);
      this.isUserIntercating = true;
    } else {
      return;
    }
    window.addEventListener("pointermove", this.handlePointerMove, false);
    this.domRef.current.addEventListener(
      "pointerup",
      this.handlePointerUp,
      false
    );
  };

  handlePointerMove = (e) => {
    e.preventDefault();
    if (this.isUserIntercating) {
      const x =
      e.clientX - this.props.renderer.domElement.getBoundingClientRect().left;
      const y =
      e.clientY - this.props.renderer.domElement.getBoundingClientRect().top;
      this.mousePosition.set(x, y);
    }
  };

  handlePointerUp = (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();
    this.isUserIntercating = false;
    this.domRef.current.classList.remove(styles.grabbing);
    this.mousePosition.copy(
      normalizeMouseCoordinates(this.mousePosition, this.props.renderer)
      );

    to3DPosition(
      this.anchor,
      this.mousePosition,
      this.props.camera,
      this.props.sphere,
      this.props.renderer
    );
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
    this.props.scene.add(this.anchor);

    const update = () => {
      requestAnimationFrame(update);

      if (this.isUserIntercating) {
        this.domRef.current.style.transform = `translate(-50%,-50%) translate(${this.mousePosition.x}px,${this.mousePosition.y}px)`;
      } else {
        const { posX, posY, visibility } = toScreenPosition(
          this.anchor,
          this.props.camera,
          this.props.renderer,
          this.props.scene
        );
        this.mousePosition.x = posX;
        this.mousePosition.y = posY;

        this.domRef.current.style.transform = `translate(-50%,-50%) translate(${posX}px,${posY}px)`;
        this.domRef.current.style.display = visibility;
      }
    };
    update();
  }
  handleRotation = () => {
    this.setState((prevState) => {
      return { rotation: prevState.rotation + 30 };
    });
  };
  loadSceneOnClick = () => {};
  render() {
    return (
      <div
        className={`${styles.hotspot} ${this.isDraggable ? styles.grab : ""}`}
        ref={this.domRef}
      >
        <div>
          <SmallButton>
            <Close className={styles.close_button} />
          </SmallButton>
          <SmallButton onClick={this.handleRotation}>
            <Rotate className={styles.rotate_button} />
          </SmallButton>
        </div>
        <Arrow
          className={styles.arrow}
          style={{ transform: `rotate(${this.state.rotation}deg)` }}
          onClick={this.loadSceneOnClick}
        />
        <div>
          <SmallButton onClick={this.handleRotation}>
            <SceneList className={styles.scene_list} />
          </SmallButton>
        </div>
      </div>
    );
  }
}

export default Hotspot;
