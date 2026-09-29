import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    setError(onLogin(username, password));
  }

  return (
    <div className="login-screen">
      <div className="login-art" aria-hidden="true">
        <div className="login-art-content">
          <span className="eyebrow light">FUNews Management System</span>
          <h1>Every campus story starts here.</h1>
          <p>
            A focused workspace for managing categories, news, and the people
            behind every update.
          </p>
          <div className="art-rule" />
          <span>Assignment 01 · SBA301</span>
        </div>
      </div>
      <main className="login-panel">
        <div className="login-box">
          <div className="brand login-brand">
            <img src="/assets/funews-logo.png" alt="FUNews logo" />
            <span>
              FU<span className="brand-blue">News</span>
              <small>MANAGEMENT</small>
            </span>
          </div>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your workspace</h2>
          <p className="muted login-subtitle">
            Enter your admin credentials to continue.
          </p>
          <form onSubmit={submit} noValidate>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              placeholder="Enter username"
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Enter password"
            />
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button
              className="button button-primary login-submit"
              type="submit"
            >
              Sign in <span aria-hidden="true">→</span>
            </button>
          </form>
          <div className="demo-credentials">
            <strong>Demo access</strong>
            <span>
              Username: <b>Admin</b>
            </span>
            <span>
              Password: <b>Admin</b>
            </span>
          </div>
        </div>
        <footer className="login-footer">
          FUNews Management System · SBA301 Assignment 01
        </footer>
      </main>
    </div>
  );
}
