export const ROW_COUNT = 20;
export const COLUMN_COUNT = 10;

export const TYPES = ["I", "J", "L", "S", "Z", "T", "O"];

export const KEYS = {
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ARROW_DOWN: "ArrowDown",
  ARROW_UP: "ArrowUp",
  SPACE: "Space",
};

export const getInitialBoard = () =>
  Array.from({ length: ROW_COUNT }, () =>
    Array.from({ length: COLUMN_COUNT }, () => 0)
  );

const INITIAL_TYPE = TYPES[Math.floor(Math.random() * TYPES.length)];

const INITIAL_BOARD = getInitialBoard();
export const getInitialState = () => ({
  board: INITIAL_BOARD,
  level: 1,
  score: 0,
  lines: 0,
  pieceType: INITIAL_TYPE,
  pieceRotation: 0,
  pieceCoordinates: SHAPES[INITIAL_TYPE][0](COLUMN_COUNT / 2),
  nextPieceType: TYPES[Math.floor(Math.random() * TYPES.length)],
  delay: 1000,
  isOver: false,
  isRunning: true,
});

export const SHAPES = {
  I: {
    0: (c, n = COLUMN_COUNT) => [c - 1, c, c + 1, c + 2],
    90: (c, n = COLUMN_COUNT) => [c - n, c, c + n, c + n + n],
    180: (c, n = COLUMN_COUNT) => [c - 1, c, c + 1, c + 2],
    270: (c, n = COLUMN_COUNT) => [c - n, c, c + n, c + n + n],
  },
  S: {
    0: (c, n = COLUMN_COUNT) => [c - 1, c, c - n, c - n + 1],
    90: (c, n = COLUMN_COUNT) => [c - n, c, c + 1, c + 1 + n],
    180: (c, n = COLUMN_COUNT) => [c - 1, c, c - n, c - n + 1],
    270: (c, n = COLUMN_COUNT) => [c - n, c, c + 1, c + 1 + n],
  },
  Z: {
    0: (c, n = COLUMN_COUNT) => [c - 1, c, c + n, c + n + 1],
    90: (c, n = COLUMN_COUNT) => [c - n, c, c - 1, c - 1 + n],
    180: (c, n = COLUMN_COUNT) => [c - 1, c, c + n, c + n + 1],
    270: (c, n = COLUMN_COUNT) => [c - n, c, c - 1, c - 1 + n],
  },
  J: {
    0: (c, n = COLUMN_COUNT) => [c - 1, c, c + 1, c + 1 + n],
    90: (c, n = COLUMN_COUNT) => [c - n, c, c + n, c - 1 + n],
    180: (c, n = COLUMN_COUNT) => [c - 1, c, c + 1, c - 1 - n],
    270: (c, n = COLUMN_COUNT) => [c - n, c, c + n, c - n + 1],
  },
  L: {
    0: (c, n = COLUMN_COUNT) => [c - 1, c, c + 1, c + 1 - n],
    90: (c, n = COLUMN_COUNT) => [c - n, c, c + n, c + 1 + n],
    180: (c, n = COLUMN_COUNT) => [c - 1, c, c + 1, c - 1 + n],
    270: (c, n = COLUMN_COUNT) => [c - n, c, c + n, c - n - 1],
  },
  T: {
    0: (c, n = COLUMN_COUNT) => [c - 1, c, c + 1, c + n],
    90: (c, n = COLUMN_COUNT) => [c - 1, c, c + n, c - n],
    180: (c, n = COLUMN_COUNT) => [c - 1, c, c + 1, c - n],
    270: (c, n = COLUMN_COUNT) => [c - n, c, c + n, c + 1],
  },
  O: {
    0: (c, n = COLUMN_COUNT) => [c - 1, c, c - 1 + n, c + n],
    90: (c, n = COLUMN_COUNT) => [c - 1, c, c - 1 + n, c + n],
    180: (c, n = COLUMN_COUNT) => [c - 1, c, c - 1 + n, c + n],
    270: (c, n = COLUMN_COUNT) => [c - 1, c, c - 1 + n, c + n],
  },
};
