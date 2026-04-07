import { useState } from "react";
import { StartPage } from "./Pages/StartPage";
import { GamePage } from "./Pages/GamePage";

function App() {
  const [showGamePage, setShowGamePage] = useState(false);

  return showGamePage ? (
    <GamePage onBack={() => setShowGamePage(false)} />
  ) : (
    <StartPage onStartGame={() => setShowGamePage(true)} />
  );
}

export default App;