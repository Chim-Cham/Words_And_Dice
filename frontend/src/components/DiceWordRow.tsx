
import { useState, useEffect } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";

type Props = {
  word: string;           // e.g. "KATT"
  diceIndices: number[];  // which positions get a die, e.g. [1, 3]
  rolling: boolean;
};

function Die({ letter, rolling }: { letter: string; rolling: boolean; }) {
  const [display, setDisplay] = useState("?");

  useEffect(() => {
    if (!rolling) {
      setDisplay(letter);
      return;
    }
    const iv = setInterval(() => {
      setDisplay(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
    }, 70);
    return () => clearInterval(iv);
  }, [rolling, letter]);

  return (
    <div className="die-wrapper">
      <div className={`die-face${rolling ? " die-face--rolling" : ""}`}>
        {display}
      </div>
      <div className="die-arrow" />
      <div className="die-connector" />
    </div>
  );
}

export function DiceWordRow({ word, diceIndices, rolling }: Props) {
  const letters = word.toUpperCase().split("");

  return (
    <div className="dice-word-row">
      {/* Dice row */}
      <div className="dice-row">
        {letters.map((letter, i) => (
          <div key={i} className="dice-col">
            {diceIndices.includes(i) && (
              <Die letter={letter} rolling={rolling} />
            )}
          </div>
        ))}
      </div>

      {/* Word slots */}
      <div className="word-slots-row">
        {letters.map((letter, i) => {
          const hasDie = diceIndices.includes(i);
          return (
            <div
              key={i}
              className={`word-slot${hasDie && !rolling ? " word-slot--revealed" : ""}`}
            >
              {hasDie && !rolling ? letter : "·"}
            </div>
          );
        })}
      </div>
    </div>
  );
}