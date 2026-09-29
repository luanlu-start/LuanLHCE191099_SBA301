import { seed } from "../data/seed.js";

const DATA_KEY = "funews-assignment-01-data";
const SESSION_KEY = "funews-assignment-01-session";

export function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(DATA_KEY));
    if (
      saved &&
      ["categories", "news", "users"].every((key) => Array.isArray(saved[key]))
    )
      return saved;
  } catch {
    /* Bad or unavailable storage falls back to the seed data. */
  }
  return structuredClone(seed);
}

export function saveData(data) {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  } catch {
    /* App remains usable without storage. */
  }
}

export function loadSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "Admin";
  } catch {
    return false;
  }
}

export function saveSession(isLoggedIn) {
  try {
    if (isLoggedIn) sessionStorage.setItem(SESSION_KEY, "Admin");
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* Session still works in memory. */
  }
}
