const navItems = ['Dashboard', 'Topics', 'Progress', 'Revision'];

function Sidebar({ activeView, setActiveView, darkMode, toggleDarkMode }) {
  return (
    <aside className="sidebar">
      <h1>DSA Coach</h1>
      <p className="sidebar-subtitle">90-Day Interview Prep</p>
      <nav>
        {navItems.map((item) => (
          <button
            key={item}
            className={activeView === item ? 'nav-button active' : 'nav-button'}
            onClick={() => setActiveView(item)}
          >
            {item}
          </button>
        ))}
      </nav>
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </aside>
  );
}

export default Sidebar;
