import { useState } from "react";
import "../css/GamePage.css";

type GamePageProps = { onBack: () => void };

export function GamePage({ onBack }: GamePageProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  const [level, setLevel] = useState(1);
  const [levelComplete, setLevelComplete] = useState(false);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isWrong, setIsWrong] = useState(false);

  // Kontrollerar spelarens gissning mot det rätta svaret.
  // Ger +5 poäng vid rätt svar annars markeras fel.
  function handleConfirmWord() {
    const guess = inputValue.trim().toUpperCase();
    if (guess === correctAnswer) {
      setPlayerPoints((prev) => prev + 5);
      setLevelComplete(true);
      setIsWrong(false);
    } else {
      setIsWrong(true);
    }
  }

  // Går nästa nivå
  function handleNextLevel() {
    if (level < 25) {
      setLevel((l) => l + 1);
      setLevelComplete(false);
      setInputValue("");
      setIsWrong(false);
    }
  }

  //Speldata (tillfälligt hårdkodad, ska senare hämtas från backend/API)
  const category = "Animals";
  const isPlayerTurn = true;
  const maxScore = 5;
  const missingLetter = "A"; // Bokstaven som visas som ledtråd

  // Exempelordet är CAT där C och T saknas
  const wordSlots = ["C", "A", "T"];
  const correctAnswer = wordSlots.join(""); // Det kompletta ord spelaren ska gissa
  const wordLength = wordSlots.length;
  // Spelaren behöver minst lika många poäng som ordets längd för att köpa ledtråd
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
          <div className="info-card">
            <h2>Player 1</h2>
            <div className="player-circle"></div>
            <p className="player-name">Player 1</p>
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
              disabled={!isPlayerTurn || levelComplete}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsWrong(false);
              }}
            />

            {isWrong && (
              <p className="wrong-answer-text">
                Wrong answer, try again!
              </p>
            )}

            <div className="word-actions-row">
              <div className="points-display-box">
                <span>Points: {playerPoints}</span>
              </div>
            </div>

            <button
              className="primary-button"
              type="button"
              onClick={handleConfirmWord}
              disabled={levelComplete || inputValue.trim() === ""}
            >
              Confirm Word
            </button>

            {levelComplete && (
              <div className="level-complete-panel">
                <p className="correct-answer-text">
                  Correct! +5
                  points
                </p>
                {level >= 25 ? (
                  <p>You Won! All 25 levels completed!</p>
                ) : (
                  <>
                    <button
                      className="primary-button"
                      type="button"
                      onClick={handleNextLevel}
                    >
                      Next Level
                    </button>
                  </>
                )}
              </div>
            )}
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
          <div className="info-card">
            <h2>Player 2</h2>
            <div className="player-circle opponent-circle"></div>
            <p className="player-name">Player 2</p>
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
