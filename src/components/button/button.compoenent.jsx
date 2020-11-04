import React from 'react'
import styles from './button.module.scss'
export default function Button(props) {
    return (
        <div className={styles.button}>
            <span>{props.text}</span>
        </div>
    )
}
