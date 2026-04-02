import "../css/StartPage.css";
import copyIcon from "../assets/copy.svg";

export function StartPage() {
  return (
    <div className="start-container">
      <h1 className="title">Words & Di<span className="parenthese">c</span>e</h1>
      <p className="tag-line">A challenging word game for 2 players</p>

      <div className="form-section">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Game ID"
            className="game-id"
          />
          <button className="copy-btn">
            <img src={copyIcon} alt="Copy" />
          </button>
        </div>

        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Username"
            className="username-input"
          />
        </div>

        <div className="button-group">
          <button className="btn Start">Start Game</button>
          <button className="btn joining">Join the Game</button>
        </div>
      </div>
    </div>
  );
}