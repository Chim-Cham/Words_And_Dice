import "../css/StartPage.css";

type StartPageProps = { onStartGame: () => void; };

export function StartPage({ onStartGame }: StartPageProps) {
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
          />
        </div>

        <div className="button-group">
          <button className="btn Start" type="button" onClick={onStartGame}>Invite player</button>
        </div>
      </div>
    </div>
  );
}