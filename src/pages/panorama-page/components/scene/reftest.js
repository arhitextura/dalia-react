import React, { Component } from 'react'
import styles from './reftes.module.scss'
export default class RefTest extends Component {
    constructor() {
        super()
        this.mount = React.createRef();
    }
    render() {
        return (

            <div 
            className={styles.hotspot} 
            ref={this.props.innerRef} 
            style={{ left: this.props.x, top: this.props.y, position: "absolute", display:this.props.visibility }}>Label</div>
        )
    }
}

