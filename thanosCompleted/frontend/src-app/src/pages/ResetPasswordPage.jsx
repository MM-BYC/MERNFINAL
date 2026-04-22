import { useState } from "react";
import { useParams } from "react-router-dom";
import { resetPassword } from "../utilities/users-service";
import "../App.css";
import DateDisplay from "../components/DateDisplay";
import SnapNoteBrand from "../components/SnapNoteBrand";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const disable = password !== confirm || password.length < 3;

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const res = await resetPassword(token, password);
      setMessage(res.message);
      setError("");
    } catch (err) {
      setError(err.message || "Password reset failed.");
    }
  }

  return (
    <>
    <DateDisplay className="page-date" />
    <SnapNoteBrand scrollParallax />
    <div className="auth-card">
      <h2 className="auth-title">Reset Password</h2>
      {message ? (
        <>
          <p style={{ textAlign: "center", color: "#4a90e2" }}>{message}</p>
          <a href="/" className="auth-btn" style={{ display: "block", textAlign: "center", marginTop: "1rem", textDecoration: "none" }}>
            Go to Login
          </a>
        </>
      ) : (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" type="submit" disabled={disable}>
            Reset Password
          </button>
        </form>
      )}
    </div>
    </>
  );
}
