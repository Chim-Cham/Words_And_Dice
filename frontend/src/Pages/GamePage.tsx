import { useState, useEffect } from "react";
import "../css/GamePage.css";
import { DiceWordRow } from "../components/DiceWordRow";


type GamePageProps = { onBack: () => void };

export function GamePage({ onBack }: GamePageProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [rolling, setRolling] = useState(true);
  // Endast enkel UI-demo just nu
  const level = 1;
  const category = "Animals";
  const isPlayerTurn = true;
  const playerPoints = 0;
  const maxScore = 5;

  // Exempelordet är CAT där C och T saknas
  const wordSlots = ["b", "o", "a", "T"];
  function randomIndices(slots: string[]) {
    const indices = slots.map((_, i) => i);
    indices.sort(() => Math.random() - 0.5);
    return indices.slice(0, 2);
  }
  const [diceIndices, setDiceIndices] = useState(() => randomIndices(wordSlots));
  function reroll() {
    setDiceIndices(randomIndices(wordSlots));
    setRolling(true);
    setTimeout(() => setRolling(false), 1400);
  }
  const wordLength = wordSlots.length;
  const canUseHint = playerPoints >= wordLength;
  useEffect(() => {                                     // ← and this
    const t = setTimeout(() => setRolling(false), 1400);
    return () => clearTimeout(t);
  }, []);


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
          {/* THIS IS TEMPORARY FOR TESTING REMOVE BEFORE PUSH TO MAIN*/}
          <button className="back-button" type="button" onClick={reroll}
            style={{ left: "auto", right: 20 }}>
            Reroll
          </button>
        </aside>

        <section className="game-center">
          <div className="top-row">
            <div className="category-box">Category: {category}</div>
            <div className="status-box">
              {isPlayerTurn ? "Your turn" : "Waiting for opponent"}
            </div>
          </div>

          <div className="word-area">
            <DiceWordRow
              word={wordSlots.join("")}
              diceIndices={diceIndices}
              rolling={rolling}
            />

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
