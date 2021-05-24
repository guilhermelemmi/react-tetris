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
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const shapes = {
  i: {
    0: (n, c) => [c - 1, c, c + 1, c + 2],
    90: (n, c) => [c - n, c, c + n, c + n + n],
    180: (n, c) => [c - 1, c, c + 1, c + 2],
    270: (n, c) => [c - n, c, c + n, c + n + n],
  },
  s: {
    0: (n, c) => [c - 1, c, c - n, c - n + 1],
    90: (n, c) => [c - n, c, c + 1, c + 1 + n],
    180: (n, c) => [c - 1, c, c - n, c - n + 1],
    270: (n, c) => [c - n, c, c + 1, c + 1 + n],
  },
  z: {
    0: (n, c) => [c - 1, c, c + n, c + n + 1],
    90: (n, c) => [c - n, c, c - 1, c - 1 + n],
    180: (n, c) => [c - 1, c, c + n, c + n + 1],
    270: (n, c) => [c - n, c, c - 1, c - 1 + n],
  },
  j: {
    0: (n, c) => [c - 1, c, c + 1, c + 1 + n],
    90: (n, c) => [c - n, c, c + n, c - 1 + n],
    180: (n, c) => [c - 1, c, c + 1, c - 1 - n],
    270: (n, c) => [c - n, c, c + n, c - n + 1],
  },
  l: {
    0: (n, c) => [c - 1, c, c + 1, c + 1 - n],
    90: (n, c) => [c - n, c, c + n, c + 1 + n],
    180: (n, c) => [c - 1, c, c + 1, c - 1 + n],
    270: (n, c) => [c - n, c, c + n, c - n - 1],
  },
  t: {
    0: (n, c) => [c - 1, c, c + 1, c + n],
    90: (n, c) => [c - 1, c, c + n, c - n],
    180: (n, c) => [c - 1, c, c + 1, c - n],
    270: (n, c) => [c - n, c, c + n, c + 1],
  },
  o: {
    0: (n, c) => [c - 1, c, c - 1 + n, c + n],
    90: (n, c) => [c - 1, c, c - 1 + n, c + n],
    180: (n, c) => [c - 1, c, c - 1 + n, c + n],
    270: (n, c) => [c - 1, c, c - 1 + n, c + n],
  },
};
const n = initialBoard[0].length;

const types = ["i", "j", "l", "s", "z", "t", "o"];
const initialType = types[Math.floor(Math.random() * types.length)];

function Game() {
  let [delay] = useState(1000);
  const [isRunning, setIsRunning] = useState(true);
  const [isOver, setIsOver] = useState(false);

  let [board, setBoard] = useState(initialBoard);
  let [pieceType, setPieceType] = useState(initialType);
  let [pieceRotation, setPieceRotation] = useState(0);

  let [pieceCoordinates, setPieceCoordinates] = useState(
    shapes[initialType][0](n, n / 2)
  );

  let [nextPieceType, setNextPieceType] = useState(
    types[Math.floor(Math.random() * types.length)]
  );

  const willCollide = useCallback(() => {
    const isAtBottomRow = Math.max(...pieceCoordinates) / n >= board.length - 1;
    return (
      isAtBottomRow ||
      pieceCoordinates
        .filter((block) => block > 0)
        .some((block) => {
          console.log("block", block);
          const coords = block.toString().split("");
          console.log("coords", coords);
          const col = parseInt(coords.pop(), 10);
          console.log("col", col);
          const row = coords.length ? parseInt(coords.join(""), 10) + 1 : 1;
          console.log("row", row);
          return board[row][col];
        })
    );
  }, [pieceCoordinates, board]);

  const move = useCallback(
    (increment) => {
      if (!willCollide()) {
        setPieceCoordinates(pieceCoordinates.map((block) => block + increment));
      }
    },
    [pieceCoordinates, willCollide]
  );

  const rotate = useCallback(() => {
    const newRotation = pieceRotation !== 270 ? pieceRotation + 90 : 0;
    setPieceRotation(newRotation);
    setPieceCoordinates(shapes[pieceType][newRotation](n, pieceCoordinates[1]));
  }, [pieceCoordinates, pieceRotation, pieceType]);

  const handleKeyDown = useCallback(
    (e) => {
      switch (e.code) {
        case "ArrowLeft":
          move(-1);
          break;
        case "ArrowRight":
          move(1);
          break;
        case "ArrowDown":
          move(10);
          break;
        case "Space":
          rotate();
          break;
        default:
      }
    },
    [move, rotate]
  );

  useInterval(
    () => {
      if (!willCollide()) {
        setPieceCoordinates(pieceCoordinates.map((block) => block + 10));
      } else {
        let updatedBoard = [...board];
        pieceCoordinates.forEach((block) => {
          const coords = block.toString().split("");
          const col = parseInt(coords.pop(), 10);
          const row = parseInt(coords.join(""), 10);
          if (updatedBoard[row]) {
            updatedBoard[parseInt(coords.join(""), 10)][col] = pieceType;
          } else {
            setIsRunning(false);
            setIsOver(true);
          }
        });

        setBoard(updatedBoard);

        setPieceType(nextPieceType);
        setPieceCoordinates(shapes[nextPieceType][0](n, 5));
        setPieceRotation(0);
        setNextPieceType(types[Math.floor(Math.random() * types.length)]);
      }
    },
    isRunning ? delay : null
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    let rowsToClear = [];
    for (let i = board.length - 1; i >= 0; i--) {
      const row = board[i];
      if (row.every((cell) => cell)) {
        rowsToClear.push(i);
      }
    }

    if (rowsToClear.length) {
      setIsRunning(false);
      let updatedBoard = [...board];
      for (let i = 0; i < rowsToClear.length; i++) {
        updatedBoard.splice(rowsToClear[i] + i, 1);
        updatedBoard.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
      setBoard(updatedBoard);
      setIsRunning(true);
    }
  }, [board]);

  const rows = board.map((row, i) => {
    const cells = row.map((cell, j) => (
      <div
        className={`cell ${cell ? cell : ""} ${
          pieceCoordinates.indexOf(parseInt(`${i}${j}`, 10)) >= 0
            ? pieceType
            : ""
        }`}
      ></div>
    ));
    return <div className="row">{cells}</div>;
  });

  return (
    <>
      {isOver && <h1>Game Over</h1>}
      <div tabIndex="0" className="game" onKeyDown={handleKeyDown}>
        <div className="board">{rows}</div>
      </div>
    </>
  );
}

export default Game;
