import "../css/InvitePage.css";
import copyIcon from "../assets/copy.svg";

type InvitePageProps = {
  gameId: string;
  onContinue: () => void;
};

export function InvitePage({ gameId, onContinue }: InvitePageProps) {
  const inviteLink = `${window.location.origin}/join/${gameId}`;

  return (
    <div className="invite-container">
      <h1 className="title">Invite player 2 to join your game</h1>
      <p className="tag-line">Share this link with your friend</p>

      <div className="form-section">

        <div className="info-box">
          <p className="info-label">Game ID:</p>

          <div className="info-row">
            <span className="info-value">{gameId}</span>
            <button className="copy-btn">
              <img src={copyIcon} alt="Copy" />
            </button>
          </div>
        </div>

        <div className="info-box">
          <p className="info-label">Invite Link:</p>

          <div className="info-row">
            <span className="info-value">{inviteLink}</span>
            <button className="copy-btn">
              <img src={copyIcon} alt="Copy" />
            </button>
          </div>
        </div>

        <div className="button-group">
          <button className="btn Start" onClick={onContinue}>
            Continute to Game
          </button>
        </div>

      </div>
    </div>
  );
}