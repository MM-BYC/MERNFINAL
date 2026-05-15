// LoginForm.jsx

import { useState } from "react";
import * as usersService from "../utilities/users-service";

export default function LoginForm({ setUser }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(evt) {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
    setError("");
  }

  async function handleSubmit(evt) {
    // Prevent form from being submitted to the server
    evt.preventDefault();
    try {
      // The promise returned by the signUp service method
      // will resolve to the user object included in the
      // payload of the JSON Web Token (JWT)
      const user = await usersService.login(credentials);
      await setUser(user);
    } catch (err) {
      setError(err.message || "Log In Failed - Try Again");
    }
  }

  return (
    <div className="auth-card">
      <h2 className="auth-title">Welcome Back</h2>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="auth-field">
          <label>Password</label>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              style={{ paddingRight: "40px", width: "100%" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                padding: "0",
              }}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button className="auth-btn" type="submit">
          Log In
        </button>
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          <a href="/forgot-password" className="auth-link">
            Forgot Password?
          </a>
        </p>
      </form>
    </div>
  );
}
