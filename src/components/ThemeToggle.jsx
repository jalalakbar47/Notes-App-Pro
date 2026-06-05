import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} id="theme-toggle-btn">
      <div className="theme-toggle-track">
        <Sun size={14} className="theme-icon sun-icon" />
        <Moon size={14} className="theme-icon moon-icon" />
        <div className="theme-toggle-thumb" />
      </div>
    </button>
  );
}
