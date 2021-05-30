function LeftSidebar({ score, level, lines }) {
  return (
    <section className="sidebar left">
      <div className="score">
        <h4>Score</h4>
        <div>{score}</div>
      </div>
      <div className="level">
        <h4>Level</h4>
        <div>{level}</div>
      </div>
      <div className="lines">
        <h4>Lines</h4>
        <div>{lines}</div>
      </div>
    </section>
  );
}

export default LeftSidebar;
