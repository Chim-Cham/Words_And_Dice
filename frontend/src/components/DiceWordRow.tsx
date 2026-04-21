import "../css/DiceWordRow.css"
import { useState, useEffect } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";

type Props = {
  word: string;
  diceIndices: number[];
  hintIndices?: number[];
  wordSlots: string[];
  rolling: boolean;
};

function DieSlot({ letter, rolling, hasDie, isHint, isPreRevealed }: {
  letter: string; rolling: boolean; hasDie: boolean; isHint: boolean; isPreRevealed: boolean
}) {
  const [display, setDisplay] = useState("?");
  const [phase, setPhase] = useState<"rolling" | "idle" | "sliding" | "settled">("rolling");

  useEffect(() => {
    if (rolling) {
      setPhase("rolling");
      const iv = setInterval(() => {
        setDisplay(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
      }, 70);
      return () => clearInterval(iv);
    } else {
      setDisplay(letter);
      setPhase("idle");
      const slide = setTimeout(() => setPhase("sliding"), 20);
      const settle = setTimeout(() => setPhase("settled"), 820);
      return () => { clearTimeout(slide); clearTimeout(settle); };
    }
  }, [rolling, letter]);

  return (
    <div className="dice-slot-col">
      <div className={`word-slot ${hasDie || isPreRevealed ? "word-slot--revealed" : "word-slot--empty"}`}>
        {isPreRevealed && !hasDie && <span>{letter}</span>}
      </div>
      {hasDie && (
        <div className={`die-face die-face--${phase}${isHint ? " die-face--hint" : ""}`}>
          {display}
        </div>
      )}
    </div>
  );
}

export function DiceWordRow({ word, diceIndices, hintIndices = [], wordSlots, rolling }: Props) {
  const letters = word.toUpperCase().split("");

  return (
    <div className="dice-word-row">
      {letters.map((letter, i) => {
        const isPreRevealed = wordSlots[i] !== "";
        const hasDie = diceIndices.includes(i) || hintIndices.includes(i);
        const isHint = hintIndices.includes(i);
        console.log("rendering - diceIndices:", diceIndices, "hintIndices:", hintIndices, "wordSlots:", wordSlots);
        return (
          <DieSlot
            key={`${i}-${isHint ? 'hint' : hasDie ? 'die' : 'empty'}`}
            letter={letter}
            rolling={rolling}
            hasDie={hasDie}
            isHint={isHint}
            isPreRevealed={isPreRevealed}
          />
        );
      })}
    </div>
  );
}