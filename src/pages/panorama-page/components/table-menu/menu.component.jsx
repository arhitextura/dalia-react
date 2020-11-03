import React from 'react'
import styles from './menu.module.scss'

import { useSelector, useDispatch } from "react-redux";
import { addHotspot, changeTexture } from "../../components/scene/sceneSlice";

import {ReactComponent as InsertPhoto} from '../../../../icons/insert_photo-black-48dp.svg'
import SmallButton from '../small-button/small-button.component'

export default function Menu() {
    const dispatch = useDispatch();
    
    return (
        <div className={styles.menu_container}>
            <SmallButton onClick={dispatch(addHotspot({x:0, y:0, z:0, linkTo: "https://Link.to", id:"1"}))}>
                <InsertPhoto className = {styles.insert_photo}/>
            </SmallButton> 
        </div>
    )
}
