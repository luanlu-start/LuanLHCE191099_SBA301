import { useState } from "react";
import { filterRecords, validateRecord } from "../lib/records.js";

const detail = {
  categories: {
    eyebrow: "CONTENT ORGANIZATION",
    title: "Categories",
    singular: "Category",
    description: "Create and maintain the topics used by news articles.",
    search: "Search categories by name...",
  },
  news: {
    eyebrow: "CONTENT MANAGEMENT",
    title: "News",
    singular: "News article",
    description: "Write, organize, and manage your campus articles.",
    search: "Search news by title, content, category...",
  },
  users: {
    eyebrow: "ACCOUNT MANAGEMENT",
    title: "Users",
    singular: "User",
    description: "Manage the accounts and roles in your workspace.",
    search: "Search users by username...",
  },
};

function emptyForm(type, categories, users) {
  if (type === "categories") return { name: "", status: 1 };
  if (type === "users")
    return { username: "", password: "", role: 2, status: 1 };
  return {
    title: "",
    content: "",
    categoryId: categories[0]?.id ?? "",
    createdBy: users[0]?.id ?? "",
    tags: "",
    status: 1,
  };
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField({ id, label, value, onChange, options }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        <span className="required"> *</span>
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.length === 0 && <option value="">No options available</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ManagementPage({
  type,
  records,
  categories,
  users,
  news,
  onSave,
  onDelete,
}) {
  const config = detail[type];
  const [keyword, setKeyword] = useState("");
  const [dialog, setDialog] = useState(null);
  const [form, setForm] = useState(emptyForm(type, categories, users));
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const visible = filterRecords(type, records, keyword, categories, users);

  function openCreate() {
    setDialog({ mode: "create", item: null });
    setForm(emptyForm(type, categories, users));
    setError("");
  }

  function openEdit(item) {
    setDialog({ mode: "edit", item });
    setForm(type === "users" ? { ...item, password: "" } : { ...item });
    setError("");
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function submit(event) {
    event.preventDefault();
    const value = { ...form };
    if (type === "users" && dialog.mode === "edit" && !value.password)
      value.password = dialog.item.password;
    const message = validateRecord(
      type,
      value,
      records,
      categories,
      users,
      dialog.item?.id,
    );
    if (message) {
      setError(message);
      return;
    }
    onSave(type, value, dialog.item?.id);
    setDialog(null);
  }

  function confirmDelete() {
    const message = onDelete(type, deleting);
    if (message) setDeleteError(message);
    else {
      setDeleting(null);
      setDeleteError("");
    }
  }

  function nameOf(item) {
    return type === "categories"
      ? item.name
      : type === "users"
        ? item.username
        : item.title;
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{config.eyebrow}</span>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <button
          className="button button-primary add-button"
          type="button"
          onClick={openCreate}
        >
          ＋ Add {config.singular}
        </button>
      </div>
      <section className="panel management-panel">
        <div className="management-top">
          <div>
            <h2>All {config.title.toLowerCase()}</h2>
            <p>
              {records.length} total{" "}
              {records.length === 1 ? "record" : "records"}
            </p>
          </div>
          <div className="search-wrap">
            <span aria-hidden="true">⌕</span>
            <input
              aria-label={`Search ${config.title.toLowerCase()}`}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={config.search}
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {type === "categories" && (
                  <>
                    <th>NAME</th>
                    <th>STATUS</th>
                  </>
                )}
                {type === "news" && (
                  <>
                    <th>ARTICLE</th>
                    <th>CATEGORY</th>
                    <th>AUTHOR</th>
                    <th>STATUS</th>
                  </>
                )}
                {type === "users" && (
                  <>
                    <th>USERNAME</th>
                    <th>ROLE</th>
                    <th>STATUS</th>
                  </>
                )}
                <th className="actions-column">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id}>
                  {type === "categories" && (
                    <>
                      <td>
                        <span className="name-cell">
                          <span className="row-icon blue">▤</span>
                          <strong>{item.name}</strong>
                        </span>
                      </td>
                      <td>
                        <Status value={item.status} />
                      </td>
                    </>
                  )}
                  {type === "news" && (
                    <>
                      <td>
                        <span className="name-cell">
                          <span className="row-icon coral">▧</span>
                          <span>
                            <strong>{item.title}</strong>
                            <small>{item.content}</small>
                          </span>
                        </span>
                      </td>
                      <td>
                        {categories.find(
                          (category) => category.id === item.categoryId,
                        )?.name ?? "Unknown"}
                      </td>
                      <td>
                        {users.find((user) => user.id === item.createdBy)
                          ?.username ?? "Unknown"}
                      </td>
                      <td>
                        <Status value={item.status} />
                      </td>
                    </>
                  )}
                  {type === "users" && (
                    <>
                      <td>
                        <span className="name-cell">
                          <span className="user-avatar">
                            {item.username.charAt(0).toUpperCase()}
                          </span>
                          <strong>{item.username}</strong>
                        </span>
                      </td>
                      <td>
                        <span className="role-badge">
                          {item.role === 1 ? "Admin" : "Staff"}
                        </span>
                      </td>
                      <td>
                        <Status value={item.status} />
                      </td>
                    </>
                  )}
                  <td className="actions-column">
                    <div className="row-actions">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        aria-label={`Edit ${nameOf(item)}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="danger-link"
                        onClick={() => {
                          setDeleting(item);
                          setDeleteError("");
                        }}
                        aria-label={`Delete ${nameOf(item)}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && (
            <div className="empty-state">
              <span>⌕</span>
              <strong>
                {records.length === 0
                  ? `No ${config.title.toLowerCase()} yet`
                  : "No matching results"}
              </strong>
              <p>
                {records.length === 0
                  ? `Add your first ${config.singular.toLowerCase()} to get started.`
                  : "Try another search term or clear the search."}
              </p>
              {keyword && (
                <button
                  className="text-button"
                  type="button"
                  onClick={() => setKeyword("")}
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
        <div className="table-footer">
          Showing {visible.length} of {records.length} records
        </div>
      </section>
      {dialog && (
        <div className="modal-backdrop">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="record-dialog-title"
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">
                  {dialog.mode === "create" ? "NEW RECORD" : "EDIT RECORD"}
                </span>
                <h2 id="record-dialog-title">
                  {dialog.mode === "create" ? "Add" : "Edit"} {config.singular}
                </h2>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={() => setDialog(null)}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>
            <form onSubmit={submit} noValidate>
              <div className="modal-body">
                {type === "categories" && (
                  <TextField
                    id="category-name"
                    label="Category name"
                    value={form.name}
                    onChange={(value) => update("name", value)}
                    required
                    placeholder="e.g. Campus Life"
                  />
                )}
                {type === "users" && (
                  <>
                    <TextField
                      id="user-name"
                      label="Username"
                      value={form.username}
                      onChange={(value) => update("username", value)}
                      required
                      placeholder="Enter username"
                    />
                    <TextField
                      id="user-password"
                      label={
                        dialog.mode === "edit"
                          ? "Password (leave blank to keep current)"
                          : "Password"
                      }
                      type="password"
                      value={form.password}
                      onChange={(value) => update("password", value)}
                      required={dialog.mode === "create"}
                      placeholder={
                        dialog.mode === "edit"
                          ? "Leave blank to keep current"
                          : "Enter demo password"
                      }
                    />
                    <SelectField
                      id="user-role"
                      label="Role"
                      value={form.role}
                      onChange={(value) => update("role", value)}
                      options={[
                        { value: 1, label: "Admin" },
                        { value: 2, label: "Staff" },
                      ]}
                    />
                  </>
                )}
                {type === "news" && (
                  <>
                    <TextField
                      id="news-title"
                      label="Title"
                      value={form.title}
                      onChange={(value) => update("title", value)}
                      required
                      placeholder="Enter article title"
                    />
                    <div className="field">
                      <label htmlFor="news-content">
                        Content<span className="required"> *</span>
                      </label>
                      <textarea
                        id="news-content"
                        rows="5"
                        value={form.content}
                        onChange={(event) =>
                          update("content", event.target.value)
                        }
                        placeholder="Write the article content"
                      />
                    </div>
                    <div className="field-grid">
                      <SelectField
                        id="news-category"
                        label="Category"
                        value={form.categoryId}
                        onChange={(value) => update("categoryId", value)}
                        options={categories.map((item) => ({
                          value: item.id,
                          label: item.name,
                        }))}
                      />
                      <SelectField
                        id="news-author"
                        label="Author"
                        value={form.createdBy}
                        onChange={(value) => update("createdBy", value)}
                        options={users.map((item) => ({
                          value: item.id,
                          label: item.username,
                        }))}
                      />
                    </div>
                    <TextField
                      id="news-tags"
                      label="Tags (optional)"
                      value={form.tags}
                      onChange={(value) => update("tags", value)}
                      placeholder="campus, students"
                    />
                  </>
                )}
                <SelectField
                  id="record-status"
                  label="Status"
                  value={form.status}
                  onChange={(value) => update("status", value)}
                  options={[
                    { value: 1, label: "Active" },
                    { value: 0, label: "Inactive" },
                  ]}
                />
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setDialog(null)}
                >
                  Cancel
                </button>
                <button className="button button-primary" type="submit">
                  {dialog.mode === "create" ? "Create" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleting && (
        <div className="modal-backdrop">
          <div
            className="modal confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow danger-text">CONFIRM ACTION</span>
                <h2 id="confirm-title">Delete {config.singular}?</h2>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={() => setDeleting(null)}
                aria-label="Close confirmation"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p id="confirm-message">
                Are you sure you want to delete{" "}
                <strong>{nameOf(deleting)}</strong>? This action cannot be
                undone.
              </p>
              {deleteError && (
                <p className="form-error" role="alert">
                  {deleteError}
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setDeleting(null)}
              >
                Cancel
              </button>
              <button
                className="button button-danger"
                type="button"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Status({ value }) {
  return (
    <span className={`status ${Number(value) === 1 ? "active" : "inactive"}`}>
      {Number(value) === 1 ? "Active" : "Inactive"}
    </span>
  );
}
