import { useEffect, useState } from "react";

function useKeypress(callback, delay) {
  const [keyPressed, setKeyPressed] = useState();

  const handleKeyDown = ({ key }) => {
    setKeyPressed(key);
  };

  const handleKeyUp = () => {
    setKeyPressed(null);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleKeyUp);
    };
  }, []);

  return { keyPressed };
}

export default useKeypress;
