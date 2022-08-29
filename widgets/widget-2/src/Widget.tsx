import React, { useState, Suspense } from 'react';
import moment from 'moment';
// import Title from './compnents/Title'
const Title = React.lazy(() => import('./compnents/Title'));

import styles from "./style.module.css";

const Widget:React.FC<any> = (props) => {
  const [time, setTime] = useState('');
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    let i = 0;
    setTime(moment().format('MMMM Do YYYY, h:mm:ss a'))
    setInterval(() => {
      setCount(i++);
      setTime(moment().format('MMMM Do YYYY, h:mm:ss a'))
    }, 1_000);
  }, []);

  return (
    <div className={styles['widget']}>
      <Suspense fallback={<div>Загрузка...</div>}>
        <Title />
      </Suspense>
      <div>
      </div>
      <div>Counter: {count}</div>
      <div>Time: {time}</div>
      <div>Props data: {JSON.stringify(props)}</div>
    </div>
  );
}

export default Widget;