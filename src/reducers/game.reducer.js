import { getInitialState, TYPES, SHAPES } from "../constants";

const gameReducer = (state, action) => {
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
        pieceCoordinates: SHAPES[state.nextPieceType][0](5),
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
      return getInitialState();
    default:
  }
};

export default gameReducer;
