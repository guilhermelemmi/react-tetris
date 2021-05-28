import { useState, useEffect, useCallback } from "react";
import { INITIAL_BOARD, KEYS, TYPES, SHAPES } from "../../constants";
import useInterval from "../../hooks/useInterval";

const n = INITIAL_BOARD[0].length;
const initialType = TYPES[Math.floor(Math.random() * TYPES.length)];

function Game() {
  let [delay, setDelay] = useState(1000);
  let [isRunning, setIsRunning] = useState(true);
  let [isOver, setIsOver] = useState(false);

  let [level, setLevel] = useState(1);
  let [score, setScore] = useState(0);
  let [lines, setLines] = useState(0);

  let [board, setBoard] = useState(INITIAL_BOARD);
  let [pieceType, setPieceType] = useState(initialType);
  let [pieceRotation, setPieceRotation] = useState(0);

  let [pieceCoordinates, setPieceCoordinates] = useState(
    SHAPES[initialType][0](n, n / 2)
  );

  let [nextPieceType, setNextPieceType] = useState(
    TYPES[Math.floor(Math.random() * TYPES.length)]
  );

  const willCollide = useCallback(() => {
    const isAtBottomRow = Math.max(...pieceCoordinates) / n >= board.length - 1;
    return (
      isAtBottomRow ||
      pieceCoordinates
        .filter((block) => block > 0)
        .some((block) => {
          const coords = block.toString().split("");
          const col = parseInt(coords.pop(), 10);
          const row = coords.length ? parseInt(coords.join(""), 10) : 0;
          return board[row + 1][col];
        })
    );
  }, [pieceCoordinates, board]);

  const isAtTheEdge = useCallback((block, goingLeft = false) => {
    const col = parseInt(block.toString().split("").pop(), 10);
    if (goingLeft) {
      return col === 0;
    }
    return col === n - 1;
  }, []);

  const move = useCallback(
    (increment) => {
      if (!willCollide()) {
        setPieceCoordinates(pieceCoordinates.map((block) => block + increment));
        if (increment > 1) {
          setScore(score + 1);
        }
      }
    },
    [pieceCoordinates, willCollide, score]
  );

  const rotate = useCallback(() => {
    const newRotation = pieceRotation !== 270 ? pieceRotation + 90 : 0;
    setPieceRotation(newRotation);
    setPieceCoordinates(SHAPES[pieceType][newRotation](n, pieceCoordinates[1]));
  }, [pieceCoordinates, pieceRotation, pieceType]);

  const hardDrop = useCallback(() => {}, []);

  const handleKeyDown = useCallback(
    (e) => {
      switch (e.code) {
        case KEYS.ARROW_LEFT:
          if (!pieceCoordinates.some((block) => isAtTheEdge(block, true))) {
            move(-1);
          }
          break;
        case KEYS.ARROW_RIGHT:
          if (!pieceCoordinates.some((block) => isAtTheEdge(block, false))) {
            move(1);
          }
          break;
        case KEYS.ARROW_DOWN:
          move(10);
          break;
        case KEYS.ARROW_UP:
          rotate();
          break;
        case KEYS.SPACE:
          hardDrop();
          break;
        default:
      }
    },
    [move, rotate, hardDrop, isAtTheEdge, pieceCoordinates]
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
            return;
          }
        });

        setBoard(updatedBoard);

        setPieceType(nextPieceType);
        setPieceCoordinates(SHAPES[nextPieceType][0](n, 5));
        setPieceRotation(0);
        setNextPieceType(TYPES[Math.floor(Math.random() * TYPES.length)]);
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
      setLines(lines + rowsToClear.length);

      if (lines / 10 > level) {
        setLevel(Math.floor(lines / 10));
        setDelay(delay * 0.95);
      }

      const bonus = rowsToClear.length - 1;
      const newScore = score + (rowsToClear.length + bonus) * 100 * level;
      setScore(newScore);

      let updatedBoard = [...board];
      for (let i = 0; i < rowsToClear.length; i++) {
        updatedBoard.splice(rowsToClear[i] + i, 1);
        updatedBoard.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }

      setBoard(updatedBoard);
      setIsRunning(true);
    }
  }, [board, lines, level, delay, score]);

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
      {isOver && (
        <div className="gameOver">
          <h1>Game Over</h1>
        </div>
      )}
      <section tabIndex="0" className="game" onKeyDown={handleKeyDown}>
        <section className="sidebar left">
          <div className="score">
            <h3>Score</h3>
            <div>{score}</div>
          </div>
          <div className="level">
            <h3>Level</h3>
            <div>{level}</div>
          </div>
          <div className="lines">
            <h3>Lines</h3>
            <div>{lines}</div>
          </div>
        </section>
        <section className="board">{rows}</section>
        <section className="sidebar">
          <div className="nextPiece">
            <h3>Next</h3>
            <div>{nextPieceType}</div>
          </div>
        </section>
      </section>
    </>
  );
}

export default Game;
