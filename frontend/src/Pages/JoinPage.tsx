import "../css/JoinPage.css";
import { useState } from "react";

type JoinPageProps = {
  initialGameId?: string;
  initialUsername?: string;
  onJoinGame: (gameId: string, username: string) => void;
  onBack: () => void;
};

export function JoinPage({ initialGameId, initialUsername, onJoinGame, onBack }: JoinPageProps) {

  const [gameId, setGameId] = useState(initialGameId || "");
  const [username, setUsername] = useState(initialUsername || "");

  const needsUsername = !initialUsername;
  const needsGameId = !initialGameId;

  const handleJoinClick = () => {
    if (gameId.trim() && username.trim()) {
      onJoinGame(gameId, username);
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <div className="join-container">
      <h1 className="join-title">Join Game</h1>
      <p className="tag-line">{!needsGameId ? "You're Invited to a game!" : ""}</p>

      <p className="tag-line">
        {!needsGameId
          ? "Choose a username to enter the match"
          : "Enter the Game ID to join"}
      </p>

      <div className="form-section-join">
        {needsGameId && (
          <div className="input-wrapper neon-border" >
            <input
              type="text"
              placeholder="Enter Game ID"
              className="game-id-input"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
            />
          </div>
        )}

        {needsUsername && (
          <div className="input-wrapper neon-border">
            <input
              type="text"
              placeholder="Choose your Username"
              className="game-id-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}



        <div className="button-group">
          <div className="button-group">
            <button className="btn joining" type="button" onClick={handleJoinClick}>
              {!needsGameId ? "Start Playing" : "Join Game"}
            </button>
            <button
              className="btn back"
              type="button"
              onClick={onBack}
            >
              Back
            </button>
          </div>

        </div>
      </div >
    </div >
  );
}