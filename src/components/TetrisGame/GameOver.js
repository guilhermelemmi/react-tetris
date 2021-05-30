function GameOver({ onPlayAgain }) {
  return (
    <div className="gameOver">
      <h1>Game Over</h1>
      <div className="button" onClick={onPlayAgain}>
        Play Again
      </div>
    </div>
  );
}

export default GameOver;
