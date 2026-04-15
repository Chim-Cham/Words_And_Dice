import { useState, useEffect } from "react";
import "../css/GamePage.css";
import { DiceWordRow } from "../components/DiceWordRow";

type GamePageProps = {
  gameId: string;
  playerId: string;
  onBack: () => void;

};

type ApiWord = {
  word: string;
  category: string;
  length: number;
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
  //const [gameInfo, setGameInfo] = useState<any>(null);

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
      setTimeLeft(45);
      setLoading(true);
    }
  }


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
  const hasLoadedPlayers = players.length > 0;

  const isYouPlayer1 = player1?.id === playerId;
  const isYouPlayer2 = player2?.id === playerId;

  // Hämtar alla möjliga ord från API:et
  const [currentWord, setCurrentWord] = useState<ApiWord | null>(null);
  const [loading, setLoading] = useState(true);
  const [wordSlots, setWordSlots] = useState<string[]>([]);
  const [rolling, setRolling] = useState(true);
  const [diceIndices, setDiceIndices] = useState<number[]>([]);

  // Det som tar fram ett random ord
  const categories = ["brainrot", "countries", "capitals_of_countries", "sports", "animals", "programming_languages", "games", "pc_games", "mobile_games", "companies"];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];

  const randomLength = Math.floor(Math.random() * 8) + 3; // ordlängd på mellan 3-10 bokstäver (8 + 3)

  //send word to database
  useEffect(() => {
    const syncGame = async () => {
      try {
        const res = await fetch(`http://localhost:5164/api/games/${gameId}`);
        if (res.ok) {
          const data = await res.json();
          //setGameInfo(data);

          // Om du är Player 2 och ordet har dykt upp i databasen
          if (!isYouPlayer1 && data.targetWord && !currentWord) {
            setCurrentWord({
              word: data.targetWord,
              category: data.category,
              length: data.targetWord.length
            });
            setLoading(false);
          }
        }
      } catch (err) { console.error(err); }
    };
    const interval = setInterval(syncGame, 1000);
    return () => clearInterval(interval);
  }, [gameId, isYouPlayer1, currentWord]);

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
  function randomIndices(slots: string[]) {
    const indices = slots.map((_, i) => i);
    indices.sort(() => Math.random() - 0.5);
    return indices.slice(0, 2);
  }

  function reroll() {
    setDiceIndices(randomIndices(wordSlots));
    setRolling(true);
    setTimeout(() => setRolling(false), 1400);
  }


  useEffect(() => {
    if (!isYouPlayer1) return;
    async function loadWord() {
      try {
        const res = await fetch(`http://localhost:5164/api/word/${randomCategory}/${randomLength}`);
        const data = await res.json();

        const wordObj = data[0];

        const newWord = {
          word: wordObj.word,
          category: wordObj.category,
          length: wordObj.length
        };
        setCurrentWord(newWord);

        await fetch(`http://localhost:5164/api/games/${gameId}/word`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newWord)
        });

      } catch (err) {
        console.error("Failed to fetch word:", err);
      } finally {
        setLoading(false);
      }
    }

    loadWord();
  }, [isYouPlayer1, level]);

  useEffect(() => {
    if (currentWord) {
      const slots = generateWordSlots(currentWord.word);
      setWordSlots(slots);
      setDiceIndices(randomIndices(slots));
    }
  }, [currentWord]);

  useEffect(() => {                                     // ← and this
    const t = setTimeout(() => setRolling(false), 1400);
    return () => clearTimeout(t);
  }, []);


  if (!hasLoadedPlayers || loading || !currentWord) {
    return (
      <div className="game-page">
        <div className="loading-container">
          <p>Loading word...</p>
          {!hasLoadedPlayers && <p style={{ fontSize: '12px' }}>Syncing players...</p>}
          {hasLoadedPlayers && !currentWord && <p style={{ fontSize: '12px' }}>Waiting for Host to pick a word...</p>}
        </div>
      </div>
    );
  }




  const wordLength = currentWord.length;
  const correctAnswer = currentWord.word.toUpperCase();
  const category = currentWord.category;
  const isPlayerTurn = true;
  const maxScore = 5;
  const canUseHint = playerPoints >= wordLength;

  const isInputDisabled = !isPlayerTurn || timeLeft === 0 || levelComplete;



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

            <div className="timer-box" style={{ color: timeLeft <= 10 ? 'red' : 'inherit', fontWeight: 'bold', fontSize: '1.2rem' }}>
              Time: {timeLeft}s
            </div>

            <div className="status-box">
              {timeLeft === 0 ? "Time is up!" : (isPlayerTurn ? "Your turn" : "Waiting for opponent")}
            </div>
          </div>



          <div className="word-area">
            <DiceWordRow
              word={currentWord.word.toUpperCase()}
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
              disabled={isInputDisabled}
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
              {/* </button><button className="primary-button" type="button" disabled={isInputDisabled}> */}

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
