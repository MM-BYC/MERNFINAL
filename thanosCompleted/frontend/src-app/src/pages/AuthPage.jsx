import { React, useState } from "react";
import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";
import DateDisplay from "../components/DateDisplay";
export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      <DateDisplay className="page-date" />
      <h1 className="snapnote-brand">SnapNote</h1>
      <div className="auth-toggle">
        <button
          className={`auth-toggle-btn ${!showLogin ? "active" : ""}`}
          onClick={() => setShowLogin(false)}
        >
          Sign Up
        </button>
        <button
          className={`auth-toggle-btn ${showLogin ? "active" : ""}`}
          onClick={() => setShowLogin(true)}
        >
          Log In
        </button>
      </div>
      {showLogin ? (
        <LoginForm setUser={setUser} />
      ) : (
        <SignUpForm setUser={setUser} />
      )}
    </>
  );
}
