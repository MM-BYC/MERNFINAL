import { Link } from "react-router-dom";

function SnapNoteHomeLogo({ className = "" }) {
  return (
    <Link
      to="/"
      className={`snapnote-home-logo ${className}`.trim()}
      aria-label="Go to SnapNote home"
    >
      <span className="snapnote-home-mark" aria-hidden="true">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <rect x="5" y="3" width="22" height="28" rx="5" fill="url(#noteGradient)" />
          <path d="M12 11H22M12 17H20M12 23H18" stroke="white" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M23 3V10C23 11.657 24.343 13 26 13H28" fill="#B9FFF2" />
          <path d="M23 3V10C23 11.657 24.343 13 26 13H28" stroke="#008A72" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="24.5" cy="24.5" r="6.5" fill="#34C759" />
          <path d="M21.8 24.8L23.6 26.6L27.5 22.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="noteGradient" x1="6" y1="4" x2="28" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00FCCE" />
              <stop offset="0.55" stopColor="#00A88C" />
              <stop offset="1" stopColor="#006B5A" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      <span className="snapnote-home-text">SnapNote</span>
    </Link>
  );
}

export default SnapNoteHomeLogo;
