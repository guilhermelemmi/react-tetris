import Row from "./Row";

function Board({ board, pieceCoordinates, pieceType }) {
  return (
    <section className="board main-board">
      {board.map((row, i) => (
        <Row
          key={`row-${i}`}
          cells={row}
          rowIndex={i}
          pieceCoordinates={pieceCoordinates}
          pieceType={pieceType}
        />
      ))}
    </section>
  );
}

export default Board;
