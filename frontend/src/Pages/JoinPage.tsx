import "../css/JoinPage.css";
//import copyIcon from "../assets/copy.svg";
import { useState } from "react";

type JoinPageProps = {
  onJoinGame: (gameId: string) => void;
  onBack: () => void;
};

export function JoinPage({ onJoinGame, onBack }: JoinPageProps) {

  const [inputId, setInputId] = useState("");

  return (
    <div className="join-container">
      <h1 className="join-title">Join Game</h1>
      <p className="tag-line">Enter the Game ID to join the match</p>

      <div className="form-section">
        {/* <div className="game-info-box">
          <p className="info-text">Share this Game ID with player 2:</p>

          <div className="game-id-display">
            <span className="game-id">XXXX-XXXX</span>
            <button className="copy-btn">
              <img src={copyIcon} alt="Copy Game ID" />
            </button>
          </div>
        </div> */}

        <div className="input-wrapper neon-border">
          <input
            type="text"
            placeholder="Enter Game ID"
            className="game-id-input"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button className="btn joining" type="button" onClick={() => onJoinGame(inputId)}>
            Join Game
          </button>
          <button
            className="btn back"
            type="button"
            onClick={onBack}
            style={{ marginTop: '10px' }}
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
}