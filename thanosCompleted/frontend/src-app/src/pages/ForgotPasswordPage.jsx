import { useState } from "react";
import { forgotPassword } from "../utilities/users-service";
import "../App.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const res = await forgotPassword(email);
      setMessage(res.message);
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  return (
    <div className="auth-card">
      <h2 className="auth-title">Forgot Password</h2>
      {message ? (
        <p style={{ textAlign: "center", color: "#4a90e2" }}>{message}</p>
      ) : (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Enter your email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" type="submit">Send Reset Link</button>
        </form>
      )}
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        <a href="/" className="auth-link">Back to Login</a>
      </p>
    </div>
  );
}
