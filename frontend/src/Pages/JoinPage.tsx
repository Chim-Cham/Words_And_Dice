import "../css/JoinPage.css";
import copyIcon from "../assets/copy.svg";

type JoinPageProps = {
  onJoinGame: () => void;
};

export function JoinPage({ onJoinGame }: JoinPageProps) {
  return (
    <div className="join-container">
      <h1 className="join-title">Join Game</h1>
      <p className="tag-line">Enter the Game ID to join the match</p>

      <div className="form-section">
        <div className="game-info-box">
          <p className="info-text">Share this Game ID with player 2:</p>

          <div className="game-id-display">
            <span className="game-id">XXXX-XXXX</span>
            <button className="copy-btn">
              <img src={copyIcon} alt="Copy Game ID" />
            </button>
          </div>
        </div>

        <div className="input-wrapper neon-border">
          <input type="text"
            placeholder="Enter Game ID"
            className="game-id-input"
          />
        </div>

        <div className="button-group">
          <button className="btn joining" type="button" onClick={onJoinGame}>
            Join Game
          </button>
        </div>

      </div>
    </div>
  );
}