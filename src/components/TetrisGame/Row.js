import Cell from "./Cell";

function Row({ cells, rowIndex, pieceCoordinates, pieceType }) {
  return (
    <div className="row">
      {cells.map((cell, i) => (
        <Cell
          key={`cell-${i}`}
          cell={cell}
          rowIndex={rowIndex}
          columnIndex={i}
          pieceType={pieceType}
          pieceCoordinates={pieceCoordinates}
        />
      ))}
    </div>
  );
}

export default Row;
