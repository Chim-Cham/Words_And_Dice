import { useState, useEffect } from "react";
import "../css/GamePage.css";
import { DiceWordRow } from "../components/DiceWordRow";

import { useEffect } from "react";


type GamePageProps = { onBack: () => void; };
type ApiWord = {
  word: string;
  category: string;
  length: number;
};

export function GamePage({ gameId, playerId, onBack }: GamePageProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  // Hämtar alla möjliga ord från API:et
  const [currentWord, setCurrentWord] = useState<ApiWord | null>(null);
  const [loading, setLoading] = useState(true);
  const [wordSlots, setWordSlots] = useState<string[]>([]);

  // Det som tar fram ett random ord
  const categories = ["brainrot", "countries", "capitals_of_countries", "sports", "animals", "programming_languages", "games", "pc_games", "mobile_games", "companies"];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];

  const randomLength = Math.floor(Math.random() * 8) + 3; // ordlängd på mellan 3-10 bokstäver (8 + 3)



  // Tar fram två random bokstäver
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

  useEffect(() => {
    async function loadWord() {
      try {
        const res = await fetch(`http://localhost:5164/api/word/${randomCategory}/${randomLength}`);
        const data = await res.json();

        const wordObj = data[0];

        setCurrentWord({
          word: wordObj.word,
          category: wordObj.category,
          length: wordObj.length
        });
      } catch (err) {
        console.error("Failed to fetch word:", err);
      } finally {
        setLoading(false);
      }
    }

    loadWord();
  }, []);

  useEffect(() => {
    if (currentWord) {
      setWordSlots(generateWordSlots(currentWord.word));
    }
  }, [currentWord]);

  if (loading || !currentWord) {
    return (
      <div className="game-page">
        <p>Loading word...</p>
      </div>
    );
  }




  const wordLength = currentWord.length;

  // Detta är samma som innan
  const level = 1;
  const category = currentWord.category;
  const isPlayerTurn = true;
  const playerPoints = 0;
  const maxScore = 5;
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
