import { useState, useEffect, useCallback } from "react";
import useInterval from "../../hooks/useInterval";

const initialBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
];

function Game() {
  let [board, setBoard] = useState(initialBoard);
  let [piece, setPiece] = useState([1, 2, 3, 4]);
  let [delay, setDelay] = useState(1000);

  const move = useCallback((increment) => {
    setPiece(piece.map((block) => block + increment));
  }, [piece]);

  const handleKeyDown = useCallback((e) => {
    switch(e.key) {
      case "ArrowLeft":
        move(-1);
        break;
      case "ArrowRight":
        move(1);
        break;
      case "ArrowDown":
        move(10);
        break;
      default:
    }
  }, [move]);

  useInterval(() => {
    if (!isPieceAtBottom(piece)) {
      setPiece(piece.map((block) => block + 10));
    }
  }, delay);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const isPieceAtBottom = (piece) => Math.max(...piece) / 10 >= 19;

  const rows = board.map((row, i) => {
    const cells = row.map((cell, j) => (
      <div className={`cell ${cell || piece.indexOf(parseInt(`${i}${j}`, 10)) >= 0 ? "active" : ""}`}></div>
    ));
    return <div className="row">{cells}</div>;
  });

  return (
    <div tabIndex="0" className="game" onKeyDown={handleKeyDown}>
      <div className="board">{rows}</div>
    </div>
  );
};

export default Game;
