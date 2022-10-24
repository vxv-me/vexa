import React from 'react';
import styles from "./style.module.css";

const Title:React.FC<any> = () => {
  React.useEffect(() => {
    console.log('Title hooks');
  }, []);

  return (
    <h2 className={styles['widget-title']}>BRICKS WIDGET 2</h2>
  );
}

export default Title;