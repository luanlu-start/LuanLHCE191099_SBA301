export default function DashboardPage({ data, onNavigate }) {
  const stats = [
    {
      label: "Total categories",
      value: data.categories.length,
      type: "categories",
      icon: "▤",
      tint: "blue",
    },
    {
      label: "News articles",
      value: data.news.length,
      type: "news",
      icon: "▧",
      tint: "coral",
    },
    {
      label: "Registered users",
      value: data.users.length,
      type: "users",
      icon: "♙",
      tint: "purple",
    },
    {
      label: "Active articles",
      value: data.news.filter((item) => item.status === 1).length,
      type: "news",
      icon: "✓",
      tint: "green",
    },
  ];
  const recent = data.news.slice(-4).reverse();
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>
            Good day, Admin <span className="wave">✦</span>
          </h1>
          <p>Here is what is happening across your news workspace.</p>
        </div>
        <span className="heading-date">SBA301 · Assignment 01</span>
      </div>
      <div className="stats-grid">
        {stats.map((item) => (
          <button
            type="button"
            className="stat-card"
            key={item.label}
            onClick={() => onNavigate(item.type)}
          >
            <span className={`stat-icon ${item.tint}`}>{item.icon}</span>
            <span className="stat-meta">
              <strong>{item.value}</strong>
              <small>{item.label}</small>
            </span>
            <span className="stat-arrow">↗</span>
          </button>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Recent news</h2>
              <p>Latest articles in your system</p>
            </div>
            <button
              type="button"
              className="text-button"
              onClick={() => onNavigate("news")}
            >
              View all →
            </button>
          </div>
          <div className="recent-list">
            {recent.length ? (
              recent.map((item) => (
                <div className="recent-item" key={item.id}>
                  <span className="recent-mark">▧</span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>
                      {data.categories.find(
                        (category) => category.id === item.categoryId,
                      )?.name ?? "Unknown category"}
                    </small>
                  </div>
                  <span
                    className={`status ${item.status === 1 ? "active" : "inactive"}`}
                  >
                    {item.status === 1 ? "Active" : "Inactive"}
                  </span>
                </div>
              ))
            ) : (
              <p className="empty-state">No news articles yet.</p>
            )}
          </div>
        </section>
        <section className="panel overview-panel">
          <div className="panel-header">
            <div>
              <h2>Quick access</h2>
              <p>Manage your workspace</p>
            </div>
          </div>
          <div className="quick-links">
            <button type="button" onClick={() => onNavigate("categories")}>
              <span>▤</span>
              <strong>Categories</strong>
              <small>Organize news topics</small>
              <b>→</b>
            </button>
            <button type="button" onClick={() => onNavigate("news")}>
              <span>▧</span>
              <strong>News</strong>
              <small>Publish and edit articles</small>
              <b>→</b>
            </button>
            <button type="button" onClick={() => onNavigate("users")}>
              <span>♙</span>
              <strong>Users</strong>
              <small>Manage team accounts</small>
              <b>→</b>
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
