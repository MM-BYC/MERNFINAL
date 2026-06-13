import { useState, useEffect } from "react";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("snapnote-theme") === "dark"
  );

  const toggleDarkMode = () => {
    setDarkMode((enabled) => !enabled);
  };

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("snapnote-theme", theme);
  }, [darkMode]);

  return (
    <button
      type="button"
      className="theme-toggle"
      role="switch"
      aria-checked={darkMode}
      onClick={toggleDarkMode}
      title="Dark mode"
    >
      <span className="theme-toggle-label theme-toggle-label-light">Light mode</span>
      <span className="theme-switch" aria-hidden="true">
        <span className="theme-switch-thumb" />
      </span>
      <span className="theme-toggle-label theme-toggle-label-dark">Dark mode</span>
    </button>
  );
}

export default ThemeToggle;
