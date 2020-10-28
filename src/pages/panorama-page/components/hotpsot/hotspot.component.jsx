import React, { Component } from "react";
import styles from "./hotspot.module.scss";
import * as THREE from "three";
import { ReactComponent as Arrow } from "../../../../icons/arrow_circle_up-24px.svg";
class Hotspot extends Component {
  constructor() {
    super();
    this.domRef = React.createRef();
    this.state = { 
      isUserIntercating:false,
      x: 0, 
      y: 0 
    };
    this.temp_geometry = new THREE.SphereBufferGeometry(10, 10, 10);
    this.temp_material = new THREE.MeshBasicMaterial({
      color: 0xFFFFAF,
      wireframe: true,
    });
    
    this.ball = new THREE.Mesh(this.temp_geometry, this.temp_material);
    this.ball.position.set(50, 0, 100);
  }
  
  handlePointerDown = (e) => {
    if (e.isPrimary === false) return;
    this.setState({isUserIntercating: true}, console.log(this.state.isUserIntercating))
    this.domRef.current.addEventListener('pointermove', this.handlePointerMove, false)
    this.domRef.current.addEventListener('pointerup', this.handlePointerUp, false)
  }
  handlePointerMove = (e) => {
      if(this.state.isUserIntercating){
        this.setState({
          x:e.clientX,
          y:e.clientY
        })
        console.log(e.screenX);
      }
  }
  handlePointerUp = (e) => {
      this.setState({isUserIntercating:false}, () => console.log(this.state.isUserIntercating))
      this.domRef.current.removeEventListener('pointermove', this.handlePointerMove, false)
      this.domRef.current.removeEventListener('pointerup', this.handlePointerUp, false)
  }

  componentDidMount() {
    this.domRef.current.addEventListener('pointerdown', this.handlePointerDown, false)
    this.props.scene.add(this.ball);
  }
  render() {
    return (
      <div
        className={styles.hotspot}
        style={{ transform: `translate(-50%,-50%) translate(${this.state.x}px,${this.state.y}px)` }}
        ref={this.domRef}
        {...this.props}
      >
        <Arrow />
      </div>
    );
  }
}

export default Hotspot;
