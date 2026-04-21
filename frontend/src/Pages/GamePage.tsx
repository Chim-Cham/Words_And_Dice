import { useState, useEffect, useRef } from "react";
import "../css/GamePage.css";
import { DiceWordRow } from "../components/DiceWordRow";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5164";

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
  isRoundReady: boolean;
};

export function GamePage({ gameId, playerId, onBack }: GamePageProps) {
  const prevWordRef = useRef<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = sessionStorage.getItem(`timeLeft_${playerId}`);
    return saved ? parseInt(saved) : 45;
  });
  const [waitingForOpponent, setWaitingForOpponent] = useState(() => {
    return sessionStorage.getItem(`waitingForOpponent_${playerId}`) === "true";
  });
  const [level, setLevel] = useState(() => {
    const saved = sessionStorage.getItem(`level_${playerId}`);
    return saved ? parseInt(saved) : 1;
  });
  const [levelComplete, setLevelComplete] = useState(false);
  const [playerPoints, setPlayerPoints] = useState(0);
  const playerPointsRef = useRef(0);
  const [inputValue, setInputValue] = useState("");
  const [isWrong, setIsWrong] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [diceIndices, setDiceIndices] = useState<number[]>(() => {
    const saved = sessionStorage.getItem(`diceIndices_${playerId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [revealedIndices, setRevealedIndices] = useState<number[]>(() => {
    const saved = sessionStorage.getItem(`revealedIndices_${playerId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [currentWord, setCurrentWord] = useState<ApiWord | null>(null);
  const [loading, setLoading] = useState(true);
  const [wordSlots, setWordSlots] = useState<string[]>(() => {
    const saved = sessionStorage.getItem(`wordSlots_${playerId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [rolling, setRolling] = useState(true);

  const categories = [
    "brainrot", "countries", "capitals", "sports", "animals",
    "programming_languages", "games", "games-pc", "games-mobile",
    "companies", "birds", "softwares", "games-console",
  ];

  async function handleConfirmWord() {
    const guess = inputValue.trim().toUpperCase();
    if (currentWord && guess === currentWord.word.toUpperCase()) {
      const newScore = playerPoints + 5;
      setPlayerPoints(newScore);
      playerPointsRef.current = newScore;
      setLevelComplete(true);
      setIsWrong(false);
      setWaitingForOpponent(true);
      try {
        await fetch(
          `${API_URL}/api/players/${playerId}/submit-round?newScore=${newScore}`,
          { method: "POST" },
        );
      } catch (e) {
        console.error("Kunde inte skicka poäng", e);
      }
    } else {
      const newScore = Math.max(0, playerPoints - 5);
      setPlayerPoints(newScore);
      playerPointsRef.current = newScore;
      setIsWrong(true);
    }
  }

  useEffect(() => {
    sessionStorage.setItem(`timeLeft_${playerId}`, String(timeLeft));
    sessionStorage.setItem(`waitingForOpponent_${playerId}`, String(waitingForOpponent));
    sessionStorage.setItem(`level_${playerId}`, String(level));
    sessionStorage.setItem(`diceIndices_${playerId}`, JSON.stringify(diceIndices));
    sessionStorage.setItem(`revealedIndices_${playerId}`, JSON.stringify(revealedIndices));
    sessionStorage.setItem(`wordSlots_${playerId}`, JSON.stringify(wordSlots));
    sessionStorage.setItem(`currentWord_${playerId}`, currentWord?.word ?? "");
  }, [timeLeft, waitingForOpponent, level, diceIndices, revealedIndices, wordSlots, currentWord, playerId]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/games/${gameId}/players`);
        if (response.ok) {
          const data = await response.json();
          setPlayers(data);
          const me = data.find((p: Player) => p.id === playerId);
          if (me && !waitingForOpponent && me.score > playerPointsRef.current) {
            setPlayerPoints(me.score);
            playerPointsRef.current = me.score;
          }
        }
      } catch (err) {
        console.error("Kunde inte hämta spelare:", err);
      }
    };
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 1000);
    return () => clearInterval(interval);
  }, [gameId, waitingForOpponent]);

  useEffect(() => {
    if (timeLeft <= 0 || waitingForOpponent) return;
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, waitingForOpponent]);

  useEffect(() => {
    if (timeLeft === 0 && !waitingForOpponent) {
      setWaitingForOpponent(true);
      fetch(
        `${API_URL}/api/players/${playerId}/submit-round?newScore=${playerPoints}`,
        { method: "POST" },
      ).catch((e) => console.error(e));
    }
  }, [timeLeft, waitingForOpponent, playerId, playerPoints]);

  const sortedPlayers = [...players].sort((a, b) => a.id.localeCompare(b.id));
  const player1 = sortedPlayers[0];
  const player2 = sortedPlayers[1];
  const hasLoadedPlayers = players.length > 0;
  const isYouPlayer1 = player1?.id === playerId;
  const isYouPlayer2 = player2?.id === playerId;

  useEffect(() => {
    const syncGame = async () => {
      try {
        const res = await fetch(`${API_URL}/api/games/${gameId}`);
        if (res.ok) {
          const data = await res.json();

          if (data.currentRound && data.currentRound > level) {
            setLevel(data.currentRound);
            setLevelComplete(false);
            setWaitingForOpponent(false);
            setInputValue("");
            setTimeLeft(45);
            setIsWrong(false);
            setLoading(true);
            setRevealedIndices([]);
            setCurrentWord(null);
            sessionStorage.removeItem(`timeLeft_${playerId}`);
            sessionStorage.removeItem(`waitingForOpponent_${playerId}`);
            sessionStorage.removeItem(`level_${playerId}`);
            sessionStorage.removeItem(`diceIndices_${playerId}`);
            sessionStorage.removeItem(`revealedIndices_${playerId}`);
            sessionStorage.removeItem(`wordSlots_${playerId}`);
            sessionStorage.removeItem(`currentWord_${playerId}`);
          }

          if (
            !isYouPlayer1 &&
            data.targetWord &&
            (!currentWord || data.targetWord !== currentWord.word)
          ) {
            setCurrentWord({
              word: data.targetWord,
              category: data.category,
              length: data.targetWord.length,
            });
            setLoading(false);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    const interval = setInterval(syncGame, 1000);
    return () => clearInterval(interval);
  }, [gameId, isYouPlayer1, currentWord, level]);

  function generateWordSlots(word: string) {
    const letters = word.toUpperCase().split("");
    const revealedIndexes = new Set<number>();
    while (revealedIndexes.size < 2) {
      revealedIndexes.add(Math.floor(Math.random() * letters.length));
    }
    return letters.map((letter, index) =>
      revealedIndexes.has(index) ? letter : "",
    );
  }

  function randomIndices(slots: string[]) {
    const hiddenIndices = slots.map((s, i) => s === "" ? i : -1).filter(i => i !== -1);
    hiddenIndices.sort(() => Math.random() - 0.5);
    return hiddenIndices.slice(0, Math.min(2, hiddenIndices.length));
  }

  function reroll() {
    setDiceIndices(randomIndices(wordSlots));
    setRolling(true);
    setTimeout(() => setRolling(false), 1400);
  }

  function buyHint() {
    const alreadyRevealed = new Set([...diceIndices, ...revealedIndices]);
    const hidden = wordSlots
      .map((_, i) => i)
      .filter((i) => !alreadyRevealed.has(i));
    if (hidden.length === 0) return;
    const pick = hidden[Math.floor(Math.random() * hidden.length)];
    setRevealedIndices((prev) => [...prev, pick]);
    const newScore = playerPoints - currentWord!.length;
    setPlayerPoints(newScore);
    playerPointsRef.current = newScore;
  }

  useEffect(() => {
    if (!isYouPlayer1) return;
    async function loadWord() {
      try {
        const gameRes = await fetch(`${API_URL}/api/games/${gameId}`);
        if (gameRes.ok) {
          const gameData = await gameRes.json();
          if (gameData.targetWord && gameData.currentRound === level) {
            setCurrentWord({
              word: gameData.targetWord,
              category: gameData.category,
              length: gameData.targetWord.length,
            });
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to check existing word:", err);
      }

      const shuffled = [...categories].sort(() => Math.random() - 0.5);
      for (const cat of shuffled) {
        try {
          const res = await fetch(`${API_URL}/api/word/${cat}/level/${level}`);
          if (!res.ok) continue;
          const data = await res.json();
          if (!data.word) continue;
          const newWord = {
            word: data.word,
            category: data.category,
            length: data.word.length,
          };
          setCurrentWord(newWord);
          await fetch(`${API_URL}/api/games/${gameId}/word`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newWord),
          });
          setLoading(false);
          return;
        } catch (err) {
          console.error(`Failed to fetch word for category ${cat}:`, err);
        }
      }
      console.error("Could not fetch a word for any category.");
      setLoading(false);
    }
    loadWord();
  }, [isYouPlayer1, level, gameId]);

  useEffect(() => {
    if (!isYouPlayer1 || players.length < 2) return;

    const p1Ready = players[0]?.isRoundReady;
    const p2Ready = players[1]?.isRoundReady;
    const hasWinner = players[0]?.score >= 100 || players[1]?.score >= 100;
    const isLastRound = level >= 25;

    if (p1Ready && p2Ready && !isTransitioning) {
      if (hasWinner || isLastRound) return;
      setIsTransitioning(true);
      fetch(`${API_URL}/api/games/${gameId}/next-round`, { method: "POST" })
        .then(() => setTimeout(() => setIsTransitioning(false), 2000))
        .catch((err) => {
          console.error(err);
          setIsTransitioning(false);
        });
    }
  }, [players, isYouPlayer1, isTransitioning, gameId, level]);

  useEffect(() => {
    if (!currentWord) return;
    if (currentWord.word === prevWordRef.current) return;
    prevWordRef.current = currentWord.word;

    const savedWord = sessionStorage.getItem(`currentWord_${playerId}`);
    const savedDice = sessionStorage.getItem(`diceIndices_${playerId}`);
    const savedSlots = sessionStorage.getItem(`wordSlots_${playerId}`);
    const savedRevealed = sessionStorage.getItem(`revealedIndices_${playerId}`);

    if (savedWord === currentWord.word && savedDice && savedSlots && JSON.parse(savedSlots).length > 0) {
      setWordSlots(JSON.parse(savedSlots));
      setDiceIndices(JSON.parse(savedDice));
      setRevealedIndices(savedRevealed ? JSON.parse(savedRevealed) : []);
    } else {
      const slots = generateWordSlots(currentWord.word);
      setWordSlots(slots);
      // Only place dice on hidden slots (not the 2 pre-revealed ones)
      const hiddenIndices = slots.map((s, i) => s === "" ? i : -1).filter(i => i !== -1);
      const shuffled = [...hiddenIndices].sort(() => Math.random() - 0.5);
      setDiceIndices(shuffled.slice(0, Math.min(2, shuffled.length)));
      setRevealedIndices([]);
    }
  }, [currentWord]);

  useEffect(() => {
    const t = setTimeout(() => setRolling(false), 1400);
    return () => clearTimeout(t);
  }, []);

  if (!hasLoadedPlayers || loading || !currentWord) {
    return (
      <div className="game-page">
        <div className="loading-container">
          <span className="loader-dice"></span>
          <p>Loading word...</p>
          {!hasLoadedPlayers && (
            <p className="loading-subtext">Syncing players...</p>
          )}
          {hasLoadedPlayers && !currentWord && (
            <p className="loading-subtext">
              Waiting for Host to pick a word...
            </p>
          )}
        </div>
      </div>
    );
  }

  const wordLength = currentWord.length;
  const category = currentWord.category;
  const isPlayerTurn = true;
  const maxScore = 5;
  const canUseHint = playerPoints >= wordLength;

  const bothReady = player1?.isRoundReady && player2?.isRoundReady;
  const isGameOver =
    bothReady &&
    (level >= 25 || player1?.score >= 100 || player2?.score >= 100);
  let winnerText = "";
  if (isGameOver) {
    if (player1.score > player2.score) {
      winnerText = `${player1.playerName} Wins with ${player1.score} pts!`;
    } else if (player2.score > player1.score) {
      winnerText = `${player2.playerName} Wins with ${player2.score} pts!`;
    } else {
      winnerText = `It's a Tie! (${player1.score} pts)`;
    }
  }

  const isInputDisabled =
    !isPlayerTurn || timeLeft === 0 || levelComplete || waitingForOpponent;

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
            <h2 className="player-name">
              {player1?.playerName || "Loading..."}
            </h2>
            <div className="player-circle"></div>
            <p className="player-score">
              Points: {isYouPlayer1 ? playerPoints : player1?.score || 0}
            </p>
          </div>

          <div className="info-card hint-card">
            <h3>Hint</h3>
            <p>Hint cost: {wordLength} points</p>
            <button
              className="secondary-button"
              type="button"
              disabled={!canUseHint}
              onClick={buyHint}
            >
              Buy Hint
            </button>
            {!canUseHint && (
              <p className="clue-warning">
                You don't have any points yet, Earn points in the game first.
              </p>
            )}
          </div>
          <button className="reroll-button" type="button" onClick={reroll}>
            Reroll
          </button>
          <button
            className="point-button"
            type="button"
            onClick={() => {
              const newScore = playerPoints + 10;
              setPlayerPoints(newScore);
              playerPointsRef.current = newScore;
            }}
          >
            +10 pts
          </button>
        </aside>

        <section className="game-center">
          <div className="top-row">
            <div className="category-box">Category: {category}</div>
            <div className={`timer-box ${timeLeft <= 10 ? "timer-warning" : ""}`}>
              Time: {timeLeft}s
            </div>
            <div className="status-box">
              {timeLeft === 0
                ? "Time is up!"
                : waitingForOpponent
                  ? "Waiting for opponent"
                  : "Your turn"}
            </div>
          </div>

          <div className="word-area">
            <DiceWordRow
              word={currentWord.word.toUpperCase()}
              diceIndices={diceIndices}
              hintIndices={revealedIndices}
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
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !waitingForOpponent &&
                  inputValue.trim() !== ""
                ) {
                  handleConfirmWord();
                }
              }}
            />

            {isWrong && (
              <p className="wrong-answer-text">Wrong answer, try again!</p>
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
              disabled={waitingForOpponent || inputValue.trim() === ""}
            >
              Confirm Word
            </button>

            {waitingForOpponent && (
              <div className="level-complete-panel">
                {!isGameOver ? (
                  <>
                    {levelComplete ? (
                      <p className="correct-answer-text">Correct! +5 points</p>
                    ) : (
                      <p className="wrong-answer-text">Time is up!</p>
                    )}
                    <p>Waiting for Player {isYouPlayer1 ? "2" : "1"}...</p>
                  </>
                ) : (
                  <div className="game-over-content">
                    <h2 className="game-over-title">Game Over!</h2>
                    <h3 className="game-over-subtitle">{winnerText}</h3>
                    <button className="primary-button" onClick={onBack}>
                      Return to Start
                    </button>
                  </div>
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
            <h2 className="player-name">
              {player2?.playerName || "Waiting..."}
            </h2>
            <div className="player-circle opponent-circle"></div>
            <p className="player-score">
              Points: {isYouPlayer2 ? playerPoints : player2?.score || 0}
            </p>
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