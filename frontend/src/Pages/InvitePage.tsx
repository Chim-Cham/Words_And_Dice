import "../css/InvitePage.css";
import copyIcon from "../assets/copy.svg";
import { useEffect, useState } from "react";

type InvitePageProps = {
  gameId: string;
  onContinue: () => void;
};


export function InvitePage({ gameId, onContinue }: InvitePageProps) {
  const [isReady, setIsReady] = useState(false);
  const inviteLink = `${window.location.origin}/join/${gameId}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  useEffect(() => {
    if (!gameId) return;
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:5164/api/games/${gameId}/players`);
        if (response.ok) {
          const players = await response.json();
          if (players.length >= 2) {
            setIsReady(true);
            onContinue();
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameId]);

  return (
    <div className="invite-container">
      <h1 className="title">Invite player 2 to join your game</h1>
      <p className="tag-line">Share this link with your friend</p>

      <div className="form-section">

        <div className="info-box">
          <p className="info-label">Game ID:</p>

          <div className="info-row">
            <span className="info-value">{gameId}</span>
            <button className="copy-btn" onClick={() => copyToClipboard(inviteLink)}>
              <img src={copyIcon} alt="Copy" />
            </button>
          </div>
        </div>

        <div className="info-box">
          <p className="info-label">Invite Link:</p>

          <div className="info-row">
            <span className="info-value">{inviteLink}</span>
            <button className="copy-btn" onClick={() => copyToClipboard(inviteLink)}>
              <img src={copyIcon} alt="Copy" />
            </button>
          </div>
        </div>

        <div className="button-group">
          <button
            className={`btn Start ${!isReady ? "disabled" : ""}`}
            onClick={onContinue}
            disabled={!isReady}
          >
            {isReady ? "Start Game" : "Waiting for Player 2..."}
          </button>
        </div>

      </div>
    </div>
  );
}