import React, { Component } from "react";
import styles from "./hotspot.module.scss";
import * as THREE from "three";
import {Vector3, Vector2} from 'three' ;
import { ReactComponent as Arrow } from "../../../../icons/arrow_circle_up-24px.svg";
import {toScreenPosition, to3DPosition, normalizeMouseCoordinates} from '../scene/utils'


class Hotspot extends Component {
  constructor(props) {
    super();
    this.domRef = React.createRef();
    this.anchor = new THREE.Object3D();
    this.anchor.name = "UniqueName";
    this.anchor.position.set(50, 0, 100);
    this.isUserIntercating = false;
    this.mousePosition = new Vector2()
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
      this.mousePosition.set(e.clientX,e.clientY)
    }
  };

  handlePointerUp = (e) => {
    e.stopImmediatePropagation();
    this.isUserIntercating = false;
    this.mousePosition = normalizeMouseCoordinates(new Vector2(e.clientX, e.clientY), this.props.renderer)
    to3DPosition(this.anchor,this.mousePosition, this.props.camera, this.props.sphere)
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

        this.domRef.current.style.transform = `translate(-50%,-50%) translate(${this.mousePosition.x}px,${this.mousePosition.y}px)`;
        this.domRef.current.style.display = visibility;
      }
      if(!this.logged){
        console.log(this);
        this.logged = true;
      }
    };
    update();
  }
  render() {
    return (
      <div
        className={styles.hotspot}
        style={{
          transform: `translate(-50%,-50%) translate(${this.mousePosition.x}px,${this.mousePosition.y}px)`,
        }}
        ref={this.domRef}
      >
        <Arrow />
      </div>
    );
  }
}

export default Hotspot;
