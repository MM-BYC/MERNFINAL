import { React, useState } from "react";
// import styles from './AuthPage.module.css';
import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";
export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
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
