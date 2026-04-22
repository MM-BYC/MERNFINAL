import { useState, useEffect } from "react";

const THEMES = ['light', 'dark', 'system'];
const THEME_ICONS = { light: '☀', dark: '🌙', system: '⚙' };

function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('snapnote-theme') || 'system'
  );

  const cycleTheme = () => {
    setTheme(prev => {
      const next = THEMES[(THEMES.indexOf(prev) + 1) % THEMES.length];
      localStorage.setItem('snapnote-theme', next);
      return next;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      root.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
      const handler = (e) => root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <button className="theme-toggle" onClick={cycleTheme} title={`Theme: ${theme}`}>
      {THEME_ICONS[theme]} {theme.charAt(0).toUpperCase() + theme.slice(1)}
    </button>
  );
}

export default ThemeToggle;
