import { useEffect, useState } from "react";
import { loadData, loadSession, saveData, saveSession } from "./lib/storage.js";
import { deletionError, nextId } from "./lib/records.js";
import LoginPage from "./components/LoginPage.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import DashboardPage from "./components/DashboardPage.jsx";
import ManagementPage from "./components/ManagementPage.jsx";
import SettingsPage from "./components/SettingsPage.jsx";

export default function App() {
  const [data, setData] = useState(loadData);
  const [authenticated, setAuthenticated] = useState(loadSession);
  const [page, setPage] = useState("dashboard");
  const [notice, setNotice] = useState("");

  useEffect(() => saveData(data), [data]);
  useEffect(() => saveSession(authenticated), [authenticated]);

  function login(username, password) {
    if (!username.trim() || !password.trim())
      return "Please enter both username and password.";
    if (username !== "Admin" || password !== "Admin")
      return "Incorrect username or password.";
    setAuthenticated(true);
    setPage("dashboard");
    return "";
  }

  function logout() {
    setAuthenticated(false);
    setPage("dashboard");
    setNotice("");
  }

  function saveRecord(type, record, editingId) {
    const clean = { ...record, status: Number(record.status) };
    if (type === "categories") clean.name = clean.name.trim();
    if (type === "users") {
      clean.username = clean.username.trim();
      clean.role = Number(clean.role);
    }
    if (type === "news") {
      clean.title = clean.title.trim();
      clean.content = clean.content.trim();
      clean.tags = clean.tags.trim();
    }
    setData((current) => ({
      ...current,
      [type]: editingId
        ? current[type].map((item) =>
            item.id === editingId ? { ...clean, id: editingId } : item,
          )
        : [...current[type], { ...clean, id: nextId() }],
    }));
    setNotice(
      `${type === "categories" ? "Category" : type === "news" ? "News article" : "User"} ${editingId ? "updated" : "created"} successfully.`,
    );
  }

  function deleteRecord(type, item) {
    const error = deletionError(type, item, data.news);
    if (error) return error;
    setData((current) => ({
      ...current,
      [type]: current[type].filter((entry) => entry.id !== item.id),
    }));
    setNotice(
      `${type === "categories" ? "Category" : type === "news" ? "News article" : "User"} deleted.`,
    );
    return "";
  }

  if (!authenticated) return <LoginPage onLogin={login} />;

  return (
    <AdminLayout
      page={page}
      onNavigate={(next) => {
        setPage(next);
        setNotice("");
      }}
      onLogout={logout}
    >
      {notice && (
        <div className="notice" role="status">
          {notice}
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}
      {page === "dashboard" && (
        <DashboardPage data={data} onNavigate={setPage} />
      )}
      {["categories", "news", "users"].includes(page) && (
        <ManagementPage
          key={page}
          type={page}
          records={data[page]}
          categories={data.categories}
          users={data.users}
          news={data.news}
          onSave={saveRecord}
          onDelete={deleteRecord}
        />
      )}
      {page === "settings" && <SettingsPage />}
    </AdminLayout>
  );
}
