import { React, useState } from "react";
import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";
import SnapNoteBrand from "../components/SnapNoteBrand";
export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      <SnapNoteBrand scrollParallax />
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
