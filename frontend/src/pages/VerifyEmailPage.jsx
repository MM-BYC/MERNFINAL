import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { verifyEmail } from "../utilities/users-service";
import "../App.css";
import DateDisplay from "../components/DateDisplay";
import SnapNoteBrand from "../components/SnapNoteBrand";
import SnapNoteHomeLogo from "../components/SnapNoteHomeLogo";
import ThemeToggle from "../components/ThemeToggle";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    verifyEmail(token)
      .then((res) => { setMessage(res.message); setSuccess(true); })
      .catch((err) => setMessage(err.message || "Verification failed."));
  }, [token]);

  return (
    <>
      <SnapNoteHomeLogo className="page-home-logo" />
      <DateDisplay className="page-date" />
      <SnapNoteBrand scrollParallax />
      <div className="page-theme-toggle">
        <ThemeToggle />
      </div>
      <div className="auth-card">
        <h2 className="auth-title">Email Verification</h2>
        <p style={{ textAlign: "center", color: success ? "#4a90e2" : "#d9534f" }}>{message}</p>
        {success && (
          <a href="/" className="auth-btn" style={{ display: "block", textAlign: "center", marginTop: "1rem", textDecoration: "none" }}>
            Go to Login
          </a>
        )}
      </div>
    </>
  );
}
