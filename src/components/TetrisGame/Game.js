import { useReducer, useEffect, useCallback } from "react";
import { getInitialState, KEYS, COLUMN_COUNT } from "../../constants";
import useInterval from "../../hooks/useInterval";
import useKeypress from "../../hooks/useKeypress";
import gameReducer from "../../reducers/game.reducer";
import Board from "./Board";
import GameOver from "./GameOver";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

const initialState = getInitialState();

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
  const [state, dispatch] = useReducer(gameReducer, { ...initialState });
  const { keyPressed } = useKeypress();

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
    const isAtBottomRow =
      Math.max(...pieceCoordinates) / COLUMN_COUNT >= board.length - 1;
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

  const move = (increment) => {
    if (willCollide()) {
      return false;
    }

    dispatch({
      type: "setPieceCoordinates",
      value: pieceCoordinates.map((block) => block + increment),
    });

    if (increment > 1) {
      dispatch({ type: "incrementScore" });
    }
  };

  useEffect(() => {
    const isAtTheEdge = (block, goingLeft = false) => {
      const col = parseInt(block.toString().split("").pop(), 10);
      if (goingLeft) {
        return col === 0;
      }
      return col === COLUMN_COUNT - 1;
    };

    // const handleKeyDown =

    // window.addEventListener("keydown", handleKeyDown);
    // return () => {
    //   window.removeEventListener("keydown", handleKeyDown);
    // };
  }, [pieceRotation, pieceCoordinates, willCollide]);

  useEffect(() => {
    switch (keyPressed) {
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
  }, [keyPressed]);

  useEffect(() => {
    let rowsToClear = [];
    for (let i = board.length - 1; i >= 0; i--) {
      const row = board[i];
      if (row.every((cell) => cell)) {
        rowsToClear.push(i);
      }
    }

    if (rowsToClear.length) {
      dispatch({ type: "clearRows", value: rowsToClear });
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
