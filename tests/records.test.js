import test from "node:test";
import assert from "node:assert/strict";
import { seed } from "../src/data/seed.js";
import {
  deletionError,
  filterRecords,
  validateRecord,
} from "../src/lib/records.js";

test("category search ignores case and surrounding spaces without changing source", () => {
  const original = structuredClone(seed.categories);
  assert.deepEqual(
    filterRecords("categories", seed.categories, "  CAMPUS  ").map(
      (item) => item.name,
    ),
    ["Campus Life"],
  );
  assert.deepEqual(seed.categories, original);
});

test("news search includes title, content, category, author and tags", () => {
  for (const keyword of ["semester", "volunteer", "Academic", "editor"]) {
    assert.ok(
      filterRecords("news", seed.news, keyword, seed.categories, seed.users)
        .length > 0,
    );
  }
  assert.equal(
    filterRecords(
      "news",
      seed.news,
      "no such result",
      seed.categories,
      seed.users,
    ).length,
    0,
  );
});

test("category and username must be nonempty and unique", () => {
  assert.match(
    validateRecord("categories", { name: " ", status: 1 }, seed.categories),
    /required/,
  );
  assert.match(
    validateRecord(
      "categories",
      { name: " campus life ", status: 1 },
      seed.categories,
    ),
    /exists/,
  );
  assert.match(
    validateRecord(
      "users",
      { username: "EDITOR", password: "x", role: 2, status: 1 },
      seed.users,
    ),
    /exists/,
  );
  assert.equal(
    validateRecord(
      "users",
      { username: "fresh", password: "x", role: 2, status: 1 },
      seed.users,
    ),
    "",
  );
});

test("news validates category and author references", () => {
  const article = {
    title: "Sample",
    content: "Content",
    categoryId: "missing",
    createdBy: "user-1",
    status: 1,
  };
  assert.match(
    validateRecord("news", article, [], seed.categories, seed.users),
    /category/,
  );
  assert.match(
    validateRecord(
      "news",
      { ...article, categoryId: "category-1", createdBy: "missing" },
      [],
      seed.categories,
      seed.users,
    ),
    /author/,
  );
});

test("categories and authors used by news cannot be deleted", () => {
  assert.match(
    deletionError("categories", seed.categories[1], seed.news),
    /used by news/,
  );
  assert.match(deletionError("users", seed.users[0], seed.news), /author/);
  assert.equal(deletionError("categories", seed.categories[3], seed.news), "");
});
