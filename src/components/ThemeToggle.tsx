'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';

const SunIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Always call useTheme at the top level to follow Rules of Hooks
  let theme = 'light';
  let toggleTheme = () => {};
  
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch (error) {
    // ThemeProvider not available yet, use defaults
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="
          relative p-2 rounded-lg
          bg-muted hover:bg-accent
          text-foreground hover:text-primary
          border border-border
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          active:scale-95
        "
        disabled
      >
        <div className="w-5 h-5">
          <SunIcon />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        relative p-2 rounded-lg
        bg-muted hover:bg-accent
        text-foreground hover:text-primary
        border border-border
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        active:scale-95
      "
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-180'
          }`}
        >
          <SunIcon />
        </div>
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
          }`}
        >
          <MoonIcon />
        </div>
      </div>
    </button>
  );
}
