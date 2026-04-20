import { useState, useEffect } from "react";
import { StartPage } from "./Pages/StartPage";
import { InvitePage } from "./Pages/InvitePage";
import { GamePage } from "./Pages/GamePage";
import { JoinPage } from "./Pages/JoinPage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5164";

function App() {
  const [page, setPage] = useState<"start" | "invite" | "game" | "join">("start");
  const [gameId, setGameId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [username, setUsername] = useState("");

  console.log(import.meta.env.VITE_API_URL, API_URL);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/join/")) {
      const idFromUrl = path.replace("/join/", "");
      if (idFromUrl) {
        setGameId(idFromUrl);
        setPage("join");
      }
    }
  }, []);



  async function handleStartGame(username: string) {
    try {
      const response = await fetch(`${API_URL}/api/games?name=${username}`, {
        method: "POST"
      });

      if (!response.ok) throw new Error("Kunde inte skapa spel");

      const gameData = await response.json();
      const idFromServer = gameData.id || gameData.Id;

      if (idFromServer) {
        setGameId(idFromServer);
        try {
          const playerRes = await fetch(`${API_URL}/api/games/${idFromServer}/players`);
          if (playerRes.ok) {
            const players = await playerRes.json();
            if (players.length > 0) {
              setPlayerId(players[0].id || players[0].Id);
            }
          }
        } catch (err) {
          console.error("Kunde inte hämta hostens playerId", err);
        }
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

  async function handleJoinSubmit(enteredGameId: string, joinUsername: string) {
    if (!enteredGameId.trim() || !joinUsername.trim()) return alert("Missing information");

    try {
      const response = await fetch(`${API_URL}/api/games/${enteredGameId}/players?name=${username}`, {
        method: "POST"
      });

      if (!response.ok) throw new Error("Kunde inte ansluta till spelet");

      const playerData = await response.json();

      setUsername(joinUsername);
      setGameId(enteredGameId);
      setPlayerId(playerData.id || playerData.Id);
      window.history.pushState({}, "", "/");
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
    return <InvitePage gameId={gameId} onContinue={handleContinue} onBack={() => setPage("start")} />;
  }

  if (page === "game") {
    return (
      <GamePage
        gameId={gameId}
        playerId={playerId}
        onBack={() => setPage("start")}
      />
    );
  }

  if (page === "join") {
    return (
      <JoinPage
        initialGameId={gameId}
        initialUsername={username}
        onJoinGame={handleJoinSubmit}
        onBack={() => {
          window.history.pushState({}, "", "/");
          setPage("start");
        }}
      />
    );
  }
  console.log("Current Player ID:", playerId);
  return <StartPage onStartGame={handleStartGame} onGoToJoin={handleGoToJoin} />;
}

export default App;
