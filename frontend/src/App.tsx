import { useState } from "react";
import { StartPage } from "./Pages/StartPage";
import { InvitePage } from "./Pages/InvitePage";
import { GamePage } from "./Pages/GamePage";

function App() {
  const [page, setPage] = useState<"start" | "invite" | "game">("start");
  const [gameId, setGameId] = useState("");
  const [playerId, setPlayerId] = useState("");

  async function handleStartGame(username: string) {
    try {
      const response = await fetch(`http://localhost:5164/api/games?word=KODNING&name=${username}`, {
        method: "POST"
      });

      if (!response.ok) throw new Error("Kunde inte skapa spel");

      const gameData = await response.json();

      const idFromServer = gameData.id || gameData.Id;
      if (idFromServer) {
        setGameId(idFromServer);
        setPage("invite");
      } else {
        console.error("Inget ID hittades i svaret:", gameData);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Kunde inte starta spelet. Kontrollera att din backend körs!");
    }
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