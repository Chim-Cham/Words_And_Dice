import { useState, useEffect } from "react";
import "../css/GamePage.css";

type GamePageProps = {
  gameId: string;
  playerId: string;
  onBack: () => void;
};

type Player = {
  id: string;
  playerName: string;
  score: number;
};

export function GamePage({ gameId, playerId, onBack }: GamePageProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [timeLeft, setTimeLeft] = useState(45); //change here if we need to have a longer display time

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch(`http://localhost:5164/api/games/${gameId}/players`);
        if (response.ok) {
          const data = await response.json();
          setPlayers(data);
        }
      } catch (err) {
        console.error("Kunde inte hämta spelare:", err);
      }
    }
    fetchPlayers();
  }, [gameId]);

  //count down logic for timer.
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const player1 = players[0];
  const player2 = players[1];

  const isYouPlayer1 = player1?.id === playerId;
  const isYouPlayer2 = player2?.id === playerId;


  // Endast enkel UI-demo just nu
  const level = 1;
  const category = "Animals";
  const isPlayerTurn = true;
  const playerPoints = 0;
  const maxScore = 5;
  const missingLetter = "A";

  // Exempelordet är CAT där C och T saknas
  const wordSlots = ["C", "A", "T"];
  const wordLength = wordSlots.length;
  const canUseHint = playerPoints >= wordLength;

  const isInputDisabled = !isPlayerTurn || timeLeft === 0;



  return (
    <div className="game-page">
      <button className="back-button" type="button" onClick={onBack}>
        Back
      </button>

      <header className="game-header">
        <h1>
          Words &amp; Di<span className="parenthese">c</span>e
        </h1>
        <p>Level {level} / 25</p>
      </header>

      <main className="game-layout">
        <aside className="game-side">
          <div className={`info-card ${isYouPlayer1 ? "local-player-highlight" : ""}`}>
            <h2>Player 1 {isYouPlayer1 ? "(You)" : ""}</h2>
            <div className="player-circle"></div>
            <p className="player-name">{player1?.playerName || "Loading..."}</p>
            <p className="player-score">Points: {player1?.score || 0}</p>
          </div>

          <div className="info-card hint-card">
            <h3>Hint</h3>
            <p>Hint cost: {wordLength} points</p>

            <button
              className="secondary-button"
              type="button"
              disabled={!canUseHint}
            >
              Buy Hint
            </button>

            {!canUseHint && (
              <p className="clue-warning">
                You don't have any points yet, Earn points in the game first.
              </p>
            )}
          </div>
        </aside>

        <section className="game-center">
          <div className="top-row">
            <div className="category-box">Category: {category}</div>

            <div className="timer-box" style={{ color: timeLeft <= 10 ? 'red' : 'inherit', fontWeight: 'bold', fontSize: '1.2rem' }}>
              Time: {timeLeft}s
            </div>

            <div className="status-box">
              {timeLeft === 0 ? "Time is up!" : (isPlayerTurn ? "Your turn" : "Waiting for opponent")}
            </div>
          </div>



          <div className="word-area">
            <div className="word-blank-slots">
              {wordSlots.map((letter, index) => (
                <div
                  key={index}
                  className={`word-blank-slot${letter === missingLetter ? " word-blank-slot--given" : ""}`}
                >
                  {letter === missingLetter ? missingLetter : ""}
                </div>
              ))}
            </div>

            <div className="word-top-row">
              <p className="section-title">Build the hidden word</p>
              <button
                className="info-icon-button"
                type="button"
                onClick={() => setShowInstructions(!showInstructions)}
                aria-label="Show instructions"
              >
                !
              </button>
            </div>

            <input
              className="word-input-field"
              type="text"
              placeholder="Type the word here..."
              maxLength={20}
              autoComplete="off"
              disabled={isInputDisabled}
            />

            <div className="word-actions-row">
              <div className="points-display-box">
                <span>Points: {playerPoints}</span>
              </div>
            </div>

            <button className="primary-button" type="button" disabled={isInputDisabled}>
              Confirm Word
            </button>
          </div>

          {showInstructions && (
            <div className="instructions-panel">
              <p>
                Try to guess the hidden word one letter at a time!
                <br />
                If you guess a letter wrong, you lose points.
              </p>
            </div>
          )}
        </section>

        <aside className="game-side">
          <div className={`info-card ${isYouPlayer2 ? "local-player-highlight" : ""}`}>
            <h2>Player 2 {isYouPlayer2 ? "(You)" : ""}</h2>
            <div className="player-circle opponent-circle"></div>
            <p className="player-name">{player2?.playerName || "Waiting..."}</p>
            <p className="player-score">Points: {player2?.score || 0}</p>
          </div>

          <div className="info-card">
            <h3>Game Status</h3>
            <p>Round: {level}</p>
            <p>{isPlayerTurn ? "You can play now" : "Please wait"}</p>
            <p>Max score this level: {maxScore}</p>
          </div>
        </aside>
      </main>
    </div>
  );
}
