import { useState } from "react";
import "../css/GamePage.css";
import { useEffect } from "react";


type GamePageProps = { onBack: () => void; };
type ApiWord = {
  word: string;
  category: string;
  length: number;
};

export function GamePage({ onBack }: GamePageProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  // Hämtar alla möjliga ord från API:et
  const [currentWord, setCurrentWord] = useState<ApiWord | null>(null);
  const [loading, setLoading] = useState(true);
  const [wordSlots, setWordSlots] = useState<string[]>([]);

  // Det som tar fram ett random ord
  const categories = ["wordle", "brainrot", "counties", "capitals_of_countries", "sports", "animals", "programing_languages", "games", "pc_games", "mobile_games", "companies"];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];

  const randomLength = Math.floor(Math.random() * 18) + 3; // ordlängd på mellan 3-20 bokstäver (18 + 3)



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
