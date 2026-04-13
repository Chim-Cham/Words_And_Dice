import { useState } from "react";
import { StartPage } from "./Pages/StartPage";
import { InvitePage } from "./Pages/InvitePage";
import { GamePage } from "./Pages/GamePage";
import { JoinPage } from "./Pages/JoinPage";

function App() {
  const [page, setPage] = useState<"start" | "invite" | "game" | "join">("start");
  const [gameId, setGameId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [username, setUsername] = useState("");

  async function handleStartGame(username: string) {
    try {
      const response = await fetch(`http://localhost:5164/api/games?name=${username}`, {
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

  function handleGoToJoin(name: string) {
    setUsername(name);
    setPage("join");
  }

  async function handleJoinSubmit(enteredGameId: string) {
    if (!enteredGameId.trim()) return alert("Ange ett Game ID");

    try {
      const response = await fetch(`http://localhost:5164/api/games/${enteredGameId}/players?name=${username}`, {
        method: "POST"
      });

      if (!response.ok) throw new Error("Kunde inte ansluta till spelet");

      const playerData = await response.json();

      setGameId(enteredGameId);
      setPlayerId(playerData.id || playerData.Id);
      setPage("game");

    } catch (error) {
      console.error("Error:", error);
      alert("Kunde inte ansluta. Kontrollera att Game ID är korrekt.");
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

  if (page === "join") {
    return <JoinPage onJoinGame={handleJoinSubmit} onBack={() => setPage("start")} />
  }

  return <StartPage onStartGame={handleStartGame} onGoToJoin={handleGoToJoin} />;
}

export default App;