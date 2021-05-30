import NextPiece from "./NextPiece";

function RightSidebar({ nextPieceType }) {
  return (
    <section className="sidebar">
      <div className="nextPiece">
        <h4>Next</h4>
        <NextPiece pieceType={nextPieceType} />
      </div>
    </section>
  );
}

export default RightSidebar;
