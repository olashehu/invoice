import ThemeContext, { useTheme } from "../context/ThemeContext";
import LogoIcon from "./icons/LogoIcon";
import IconMoon from "./icons/MoonIcon";
import IconSun from "./icons/SunIcon";

function Sidebar() {
  const { theme, toggleTheme } = useTheme(ThemeContext);
  return (
    <nav className="sidebar" aria-label="Sidebar">
      <div className="sidebar-logo">
        <LogoIcon />
      </div>
      <div className="sidebar-bottom">
        <button
          className="theme-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <IconMoon /> : <IconSun />}
        </button>
        <div className="sidebar-divider" />
        <div className="avatar" aria-hidden="true" />
      </div>
    </nav>
  );
}

export default Sidebar;
