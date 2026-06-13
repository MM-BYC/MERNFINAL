import { useState } from "react";
import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";
import DateDisplay from "../components/DateDisplay";
import SnapNoteBrand from "../components/SnapNoteBrand";
import SnapNoteHomeLogo from "../components/SnapNoteHomeLogo";
import ThemeToggle from "../components/ThemeToggle";
export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      <SnapNoteHomeLogo className="page-home-logo" />
      <DateDisplay className="page-date" />
      <SnapNoteBrand scrollParallax />
      <div className="page-theme-toggle">
        <ThemeToggle />
      </div>
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
