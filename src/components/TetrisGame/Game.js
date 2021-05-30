import { useReducer, useEffect, useCallback, useMemo } from "react";
import { getInitialBoard, KEYS, TYPES, SHAPES } from "../../constants";
import useInterval from "../../hooks/useInterval";
import Board from "./Board";
import GameOver from "./GameOver";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

const initialBoard = getInitialBoard();
const n = initialBoard[0].length;
const initialType = TYPES[Math.floor(Math.random() * TYPES.length)];

const initialState = {
  board: initialBoard,
  level: 1,
  score: 0,
  lines: 0,
  pieceType: initialType,
  pieceRotation: 0,
  pieceCoordinates: SHAPES[initialType][0](n, n / 2),
  nextPieceType: TYPES[Math.floor(Math.random() * TYPES.length)],
  delay: 1000,
  isOver: false,
  isRunning: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setPieceCoordinates":
      return { ...state, pieceCoordinates: action.value };
    case "setScore":
      return { ...state, score: action.value };
    case "incrementScore":
      return { ...state, score: state.score + 1 };
    case "setPieceRotation":
      return {
        ...state,
        pieceRotation: action.value,
        pieceCoordinates: SHAPES[state.pieceType][action.value](
          n,
          state.pieceCoordinates[1]
        ),
      };
    case "setGameOver":
      return { ...state, isOver: true, isRunning: false };
    case "setIsRunning":
      return { ...state, isRunning: action.value };
    case "settlePiece":
      return {
        ...state,
        board: action.value,
        pieceType: state.nextPieceType,
        pieceCoordinates: SHAPES[state.nextPieceType][0](n, 5),
        pieceRotation: 0,
        nextPieceType: TYPES[Math.floor(Math.random() * TYPES.length)],
      };
    case "clearRows":
      const newLines = state.lines + action.value.length;
      const levelForLines = Math.floor(newLines / 10) + 1;
      const level = levelForLines > state.level ? levelForLines : state.level;
      const delay =
        levelForLines > state.level ? state.delay * 0.95 : state.delay;
      const bonus = action.value.length - 1;
      const newScore =
        state.score + (action.value.length + bonus) * 100 * state.level;
      let updatedBoard = [...state.board];
      for (let i = 0; i < action.value.length; i++) {
        updatedBoard.splice(action.value[i] + i, 1);
        updatedBoard.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
      return {
        ...state,
        lines: newLines,
        level: level,
        delay: delay,
        score: newScore,
        board: updatedBoard,
      };
    case "resetState":
      return {
        ...initialState,
        board: getInitialBoard(),
      };
    default:
  }
};

const memoizedGetCoordinatesFromBlock = (() => {
  const cache = {};
  return (block) => {
    if (cache[block]) {
      return cache[block];
    }
    const coords = block.toString().split("");
    const col = parseInt(coords.pop(), 10);
    const row = coords.length ? parseInt(coords.join(""), 10) : 0;
    cache[block] = [row, col];
    return cache[block];
  };
})();

function Game() {
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  const {
    isOver,
    isRunning,
    delay,
    score,
    level,
    lines,
    board,
    pieceCoordinates,
    pieceType,
    pieceRotation,
    nextPieceType,
  } = state;

  const willCollide = useCallback(() => {
    const isAtBottomRow = Math.max(...pieceCoordinates) / n >= board.length - 1;
    return (
      isAtBottomRow ||
      pieceCoordinates
        .filter((block) => block > 0)
        .some((block) => {
          const [row, col] = memoizedGetCoordinatesFromBlock(block);
          return board[row + 1][col];
        })
    );
  }, [pieceCoordinates, board]);

  const hardDrop = useCallback(() => {}, []);

  useInterval(
    () => {
      if (!willCollide()) {
        dispatch({
          type: "setPieceCoordinates",
          value: pieceCoordinates.map((block) => block + 10),
        });
      } else {
        let updatedBoard = [...board];
        pieceCoordinates.forEach((block) => {
          const [row, col] = memoizedGetCoordinatesFromBlock(block);
          if (updatedBoard[row]) {
            updatedBoard[row][col] = pieceType;
          } else {
            dispatch({ type: "setGameOver" });
            return;
          }
        });
        dispatch({ type: "settlePiece", value: updatedBoard });
      }
    },
    isRunning ? delay : null
  );

  useEffect(() => {
    const move = (increment) => {
      if (!willCollide()) {
        dispatch({
          type: "setPieceCoordinates",
          value: pieceCoordinates.map((block) => block + increment),
        });
        if (increment > 1) {
          dispatch({ type: "incrementScore" });
        }
      }
    };

    const isAtTheEdge = (block, goingLeft = false) => {
      const col = parseInt(block.toString().split("").pop(), 10);
      if (goingLeft) {
        return col === 0;
      }
      return col === n - 1;
    };

    const handleKeyDown = (e) => {
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
          dispatch({
            type: "setPieceRotation",
            value: pieceRotation !== 270 ? pieceRotation + 90 : 0,
          });
          break;
        case KEYS.SPACE:
          // hardDrop();
          break;
        default:
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pieceRotation, pieceCoordinates, willCollide]);

  useEffect(() => {
    let rowsToClear = [];
    for (let i = board.length - 1; i >= 0; i--) {
      const row = board[i];
      if (row.every((cell) => cell)) {
        rowsToClear.push(i);
      }
    }

    if (rowsToClear.length) {
      dispatch({ type: "setIsRunning", value: false });
      dispatch({ type: "clearRows", value: rowsToClear });
      dispatch({ type: "setIsRunning", value: true });
    }
  }, [board]);

  return (
    <>
      {isOver && (
        <GameOver
          onPlayAgain={() => {
            dispatch({ type: "resetState" });
          }}
        />
      )}
      <section className="game">
        <LeftSidebar score={score} level={level} lines={lines} />
        <Board
          board={board}
          pieceCoordinates={pieceCoordinates}
          pieceType={pieceType}
        />
        <RightSidebar nextPieceType={nextPieceType} />
      </section>
    </>
  );
}

export default Game;
