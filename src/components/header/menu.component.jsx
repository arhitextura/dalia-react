import React from 'react'
import styles from './menu.module.scss'
import MenuButton from '../button/button.compoenent'
export default function Menu() {
    return (
        <>
            <div className={`${styles.submenu} ${styles.left}`}>
                <MenuButton text = "HOME"/>

            </div>
            <div className={styles.submenu}>
                <MenuButton text = "LOG IN"/>
                <MenuButton text = "SIGN UP"/>
                
            </div>
        </>
    )
}
