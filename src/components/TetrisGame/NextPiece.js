import { SHAPES } from "../../constants";

const n = 4;

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function NextPiece({ pieceType }) {
  const pieceCoordinates = SHAPES[pieceType][0](n, 6);

  const rows = board.map((row, i) => {
    const cells = row.map((cell, j) => {
      const pieceTypeClass =
        pieceCoordinates.indexOf(parseInt(`${1 + j + i * n}`, 10)) >= 0
          ? pieceType
          : "";
      return <div className={`cell ${pieceTypeClass}`}></div>;
    });
    return <div className="row">{cells}</div>;
  });

  return <div>{rows}</div>;
}

export default NextPiece;
