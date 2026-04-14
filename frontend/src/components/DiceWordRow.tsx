import "../css/DiceWordRow.css"
import { useState, useEffect } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";

type Props = {
  word: string;
  diceIndices: number[];
  rolling: boolean;
};

function DieSlot({ letter, rolling, hasDie }: { letter: string; rolling: boolean; hasDie: boolean }) {
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
      <div className={`word-slot${phase === "settled" ? " word-slot--revealed" : ""}`}>
        {!hasDie ? "·" : ""}
      </div>

      {hasDie && (
        <div className={`die-face die-face--${phase}`}>
          {display}
        </div>
      )}
    </div>
  );
}

export function DiceWordRow({ word, diceIndices, rolling }: Props) {
  const letters = word.toUpperCase().split("");

  return (
    <div className="dice-word-row">
      {letters.map((letter, i) => (
        <DieSlot
          key={i}
          letter={letter}
          rolling={rolling}
          hasDie={diceIndices.includes(i)}
        />
      ))}
    </div>
  );
}