function Cell({ cell, rowIndex, columnIndex, pieceCoordinates, pieceType }) {
  return (
    <div
      className={`cell ${cell ? cell : ""} ${
        pieceCoordinates.indexOf(parseInt(`${rowIndex}${columnIndex}`, 10)) >= 0
          ? pieceType
          : ""
      }`}
    ></div>
  );
}

export default Cell;
