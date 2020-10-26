import React, { Component } from 'react'

 export default class RefTest extends Component {
    constructor(){
        super()
        this.mount = React.createRef();
    }
    render() {
        return (

          <div className="Posed" ref={this.props.innerRef} style={{left:this.props.x, right:this.props.y, position:"absolute"}}>Label</div>
        )
    }
}

