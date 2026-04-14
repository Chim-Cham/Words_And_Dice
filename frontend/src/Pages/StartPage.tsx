import { useState } from "react";
import "../css/StartPage.css";

type StartPageProps = {
  onStartGame: (username: string) => void;
  onGoToJoin: (username: string) => void;
};

export function StartPage({ onStartGame, onGoToJoin }: StartPageProps) {

  const [username, setUsername] = useState("");

  const handleHostGame = () => {
    if (username.trim()) {
      onStartGame(username);
    } else {
      alert("Please enter a username first!");
    }
  };

  const handleJoinGame = () => {
    if (username.trim()) {
      onGoToJoin(username);
    } else {
      alert("Please enter a username first!");
    }
  };

  return (
    <div className="start-container">
      <h1 className="title">Words & Di<span className="parenthese">c</span>e</h1>
      <p className="tag-line">A challenging word game for 2 players</p>

      <div className="form-section">
        <div className="input-wrapper neon-border">
          <input
            type="text"
            placeholder="Username"
            className="username-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button className="btn Start" type="button" onClick={handleHostGame}>Host Game</button>
        </div>
        <div>
          <button className="btn Join" onClick={handleJoinGame}>Join Game</button>
        </div>
      </div>
    </div>
  );
}