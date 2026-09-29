const menu = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "categories", label: "Category", icon: "▤" },
  { id: "news", label: "News", icon: "▧" },
  { id: "users", label: "Users", icon: "♙" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

export default function AdminLayout({ page, onNavigate, onLogout, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand sidebar-brand">
          <img src="/assets/funews-logo.png" alt="FUNews logo" />
          <span>
            FU<span className="brand-blue">News</span>
            <small>MANAGEMENT</small>
          </span>
        </div>
        <div className="sidebar-section-title">WORKSPACE</div>
        <nav aria-label="Main navigation">
          {menu.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
              aria-current={page === item.id ? "page" : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <strong>Assignment 01</strong>
            <span>ReactJS administration</span>
          </div>
          <div className="sidebar-user">
            <span className="avatar">A</span>
            <div>
              <strong>Admin</strong>
              <small>Administrator</small>
            </div>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-context">
            <span className="topbar-marker" /> FUNews{" "}
            <span className="topbar-slash">/</span>{" "}
            <strong>{menu.find((item) => item.id === page)?.label}</strong>
          </div>
          <div className="topbar-actions">
            <span className="admin-pill">
              <span className="online-dot" /> Admin account
            </span>
            <button
              type="button"
              className="button button-ghost"
              onClick={onLogout}
            >
              Log out
            </button>
          </div>
        </header>
        <main className="content">{children}</main>
        <footer className="footer">
          © 2026 FUNews Management System{" "}
          <span>Built for SBA301 Assignment 01</span>
        </footer>
      </div>
    </div>
  );
}
