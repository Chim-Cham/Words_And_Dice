import "../css/StartPage.css";

export function StartPage() {
  return (
    <div className="start-container">
      <h1>Words & Dice</h1>
      <p className="tag-line">A challenging word game for 2 players</p>

      <div className="button-group">
        <button className="btn Start">Start Game</button>
        <button className="btn joining">Join the Game</button>
      </div>
    </div>
  );
}