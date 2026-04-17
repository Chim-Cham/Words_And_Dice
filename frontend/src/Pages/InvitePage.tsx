import "../css/InvitePage.css";
import copyIcon from "../assets/copy.svg";
import { useEffect, useState } from "react";

type InvitePageProps = {
  gameId: string;
  onContinue: () => void;
  onBack: () => void;
};


export function InvitePage({ gameId, onContinue, onBack }: InvitePageProps) {
  const [isReady, setIsReady] = useState(false);
  const inviteLink = `${window.location.origin}/join/${gameId}`;
  const inviteGuidCopy = `${gameId}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!gameId) return;
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/api/games/${gameId}/players`);
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
      <div className="placment-tag">
        <p className="tag-line">Share this link with your friend</p>
      </div>

      <div className="form-section-inv">

        <div className="info-box">
          <p className="info-label">Game ID:</p>

          <div className="info-row">
            <span className="info-value">{gameId}</span>
            <button className="copy-btn" onClick={() => copyToClipboard(inviteGuidCopy)}>
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
            <div className="waiting-for-player-container">
              <span className="loader"></span>
              {isReady ? "Start Game" : "Waiting for Player 2..."}
            </div>
          </button>

          <button
            className="btn back"
            type="button"
            onClick={onBack}
            style={{ marginTop: '10px' }}
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
}