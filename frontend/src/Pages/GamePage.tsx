import { useState, useEffect } from "react";
import "../css/GamePage.css";
import { WORDS } from "../data/words";

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

  const player1 = players[0];
  const player2 = players[1];

  const isYouPlayer1 = player1?.id === playerId;
  const isYouPlayer2 = player2?.id === playerId;


  // Random ord väljaren
  const [currentWord] = useState(() => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    return WORDS[randomIndex];
  });

  // Tar fram två "ledtrådar"
  function generateWordSlots(word: string) {
    const letters = word.toUpperCase().split("");

    const revealedIndexes = new Set<number>();
    while (revealedIndexes.size < 2) {
      revealedIndexes.add(Math.floor(Math.random() * letters.length));
    }

    return letters.map((letter, index) =>
      revealedIndexes.has(index) ? letter : ""
    );
  }

  const [wordSlots] = useState(() => generateWordSlots(currentWord.word));
  const wordLength = currentWord.length;

  // Detta är samma som innan
  const level = 1;
  const category = currentWord.category;
  const isPlayerTurn = true;
  const playerPoints = 0;
  const maxScore = 5;
  const canUseHint = playerPoints >= wordLength;


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
            <div className="status-box">
              {isPlayerTurn ? "Your turn" : "Waiting for opponent"}
            </div>
          </div>

          <div className="word-area">
            <div className="word-blank-slots">
              {wordSlots.map((letter, index) => ( // Var tvungen att ändra denna div:n
                <div
                  key={index}
                  className={`word-blank-slot${letter ? " word-blank-slot--given" : ""}`}
                >
                  {letter}
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
              disabled={!isPlayerTurn}
            />

            <div className="word-actions-row">
              <div className="points-display-box">
                <span>Points: {playerPoints}</span>
              </div>
            </div>

            <button className="primary-button" type="button">
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
