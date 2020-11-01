import React from 'react'
import styles from './small-button.module.scss'
export default function SmallButton(props) {
    return (
        <div className={styles.smallButton} {...props}>
            {props.children}
        </div>
    )
}
