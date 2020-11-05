import React from "react";
import styles from "./list.module.scss";

const InputGroupContext = React.createContext();

const useInputGroupContext = () => {
  const context = React.useContext(InputGroupContext);
  if (!context) {
    throw new Error(
      `InputGroup compound components cannot be rendered outside the InputGroup component`
    );
}
return context;
};

const List = (props) => {
  return (
    <InputGroupContext.Provider value={props}>
      <ul className={styles.container}>{props.children}</ul>
    </InputGroupContext.Provider>
  );
};


  
const Item = ({ className, ...props }) => {
    return (
      <li className={`${styles.listItem} ${className}`}>
        {props.children}
      </li>
    );
  };

List.Item = Item;
export default List;