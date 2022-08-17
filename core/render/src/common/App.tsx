import React from "react";
import { useState, useEffect } from "react";

export const App: React.FC<{ text?: string }> = ({ text }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let i = 1;
    setInterval(() => {
      setCount(i++);
    }, 1000);
  }, []);

  return (
    <div>
      <div>Hello world! ({count})</div>
      <div>text: {text}</div>
    </div>
  );
};
