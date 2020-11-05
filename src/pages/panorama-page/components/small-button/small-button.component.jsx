import React ,{useState,useEffect} from 'react'
import styles from './small-button.module.scss'
function SmallButton(props) {
    return (
        <div className={styles.smallButton} {...props}>
            {props.icon}
            {props.children}
        </div>
    )
}



function Toggle (props) {
    const [toggle, setToggle] = useState(true);
    
    const handleToggle = ()=> {
        setToggle(!toggle)
    }
    useEffect(() => {
        console.log(toggle);
    }, [toggle]);
    return (
        <SmallButton onClick = {handleToggle} {...props} >
            {toggle && props.children}
        </SmallButton>
        
    )
}

SmallButton.WithToggle = Toggle;
export default SmallButton