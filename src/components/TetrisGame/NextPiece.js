import { SHAPES } from "../../constants";

const cols = 4;

const board = Array.from({ length: cols }, () =>
  Array.from({ length: cols }, () => 0)
);

function NextPiece({ pieceType }) {
  const pieceCoordinates = SHAPES[pieceType][0](6, cols);

  const rows = board.map((row, i) => {
    const cells = row.map((cell, j) => {
      const pieceTypeClass =
        pieceCoordinates.indexOf(parseInt(`${1 + j + i * cols}`, 10)) >= 0
          ? pieceType
          : "";
      return (
        <div key={`cellnext-${j}`} className={`cell ${pieceTypeClass}`}></div>
      );
    });
    return (
      <div key={`rownext-${i}`} className="row">
        {cells}
      </div>
    );
  });

  return <div className="board">{rows}</div>;
}

export default NextPiece;
