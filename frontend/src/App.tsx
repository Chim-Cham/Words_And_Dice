import { useState } from "react";
import { StartPage } from "./Pages/StartPage";
import { InvitePage } from "./Pages/InvitePage";
import { GamePage } from "./Pages/GamePage";

function App() {
  const [page, setPage] = useState<"start" | "invite" | "game">("start");
  const [gameId, setGameId] = useState("");

  function handleStartGame() {
    const newGameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGameId(newGameId);
    setPage("invite");
  }

  function handleContinue() {
    setPage("game");
  }

  if (page === "invite") {
    return <InvitePage gameId={gameId} onContinue={handleContinue} />;
  }

  if (page === "game") {
    return <GamePage onBack={() => setPage("start")} />;
  }

  return <StartPage onStartGame={handleStartGame} />;
}

export default App;