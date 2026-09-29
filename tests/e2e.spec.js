import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

async function login(page) {
  await page.goto("/");
  await page.getByLabel("Username").fill("Admin");
  await page.getByLabel("Password").fill("Admin");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(
    page.getByRole("heading", { name: /Good day, Admin/ }),
  ).toBeVisible();
}

test("login validates credentials and protects admin layout", async ({
  page,
}) => {
  await page.goto("/");
  await mkdir("evidence", { recursive: true });
  await page.screenshot({ path: "evidence/login.png", fullPage: true });
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page.getByRole("alert")).toContainText(
    "both username and password",
  );
  await page.getByLabel("Username").fill("Admin");
  await page.getByLabel("Password").fill("wrong");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page.getByRole("alert")).toContainText("Incorrect");
  await page.screenshot({ path: "evidence/login-error.png", fullPage: true });
  await page.getByLabel("Password").fill("Admin");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("button"),
  ).toHaveCount(5);
  await page.screenshot({ path: "evidence/dashboard.png", fullPage: true });
  for (const name of ["Category", "News", "Users", "Settings", "Dashboard"]) {
    await page.getByRole("navigation").getByRole("button", { name }).click();
    await expect(
      page
        .getByRole("main")
        .getByRole("heading", {
          name:
            name === "Dashboard"
              ? /Good day, Admin/
              : name === "Category"
                ? "Categories"
                : name,
          exact: name !== "Dashboard",
        }),
    ).toBeVisible();
  }
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(
    page.getByRole("heading", { name: "Sign in to your workspace" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Sign in to your workspace" }),
  ).toBeVisible();
});

test("category CRUD, search, persistence and relation guard", async ({
  page,
}) => {
  await login(page);
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Category" })
    .click();
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(5);
  await expect(page.getByRole("table")).toContainText("Inactive");
  await page.getByRole("button", { name: /Add Category/ }).click();
  await page.screenshot({
    path: "evidence/category-dialog.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("alert")).toContainText("required");
  await page.getByLabel("Category name").fill("Research");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("table")).toContainText("Research");
  await page.getByRole("button", { name: /Add Category/ }).click();
  await page.getByLabel("Category name").fill("research");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("alert")).toContainText("already exists");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Cancel" })
    .click();
  await page
    .getByRole("textbox", { name: "Search categories" })
    .fill("  RESEARCH  ");
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(2);
  await page
    .getByRole("textbox", { name: "Search categories" })
    .fill("no-category-match");
  await expect(page.getByText("No matching results")).toBeVisible();
  await page
    .getByRole("textbox", { name: "Search categories" })
    .fill("research");
  await page.getByRole("button", { name: "Edit Research" }).click();
  await page.getByLabel("Category name").fill("Research Updates");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByRole("button", { name: "Clear search" }).last().click();
  await page.getByRole("button", { name: "Delete Research Updates" }).click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Cancel" })
    .click();
  await expect(page.getByRole("table")).toContainText("Research Updates");
  await page.getByRole("button", { name: "Delete Research Updates" }).click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Delete" })
    .click();
  await expect(page.getByRole("table")).not.toContainText("Research Updates");
  await page.getByRole("button", { name: "Delete Academic" }).click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Delete" })
    .click();
  await expect(page.getByRole("alert")).toContainText("used by news");
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Cancel" })
    .click();
  await page.reload();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Category" })
    .click();
  await expect(page.getByRole("table")).toContainText("Academic");
  await expect(page.getByRole("table")).not.toContainText("Research Updates");
  await page.screenshot({ path: "evidence/categories.png", fullPage: true });
});

test("news CRUD with category relation, search and no-result state", async ({
  page,
}) => {
  await login(page);
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "News" })
    .click();
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(4);
  await page.getByRole("button", { name: /Add News article/ }).click();
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("alert")).toContainText("title");
  await page.getByLabel("Title").fill("Library opening hours");
  await page
    .getByLabel("Content")
    .fill("The library opens at 8 a.m. on weekdays.");
  await page.getByLabel("Category").selectOption("category-2");
  await page.getByLabel("Author").selectOption("user-1");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("table")).toContainText("Library opening hours");
  await expect(
    page.getByRole("table").getByRole("row", { name: /Library opening hours/ }),
  ).toContainText("Academic");
  await page.getByRole("textbox", { name: "Search news" }).fill(" LIBRARY ");
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Edit Library opening hours" })
    .click();
  await page.getByLabel("Title").fill("Library weekend hours");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByRole("button", { name: "Clear search" }).click();
  await page
    .getByRole("textbox", { name: "Search news" })
    .fill("zzzz-not-found");
  await expect(page.getByText("No matching results")).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).last().click();
  await page
    .getByRole("button", { name: "Delete Library weekend hours" })
    .click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Cancel" })
    .click();
  await expect(page.getByRole("table")).toContainText("Library weekend hours");
  await page
    .getByRole("button", { name: "Delete Library weekend hours" })
    .click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Delete" })
    .click();
  await expect(page.getByRole("table")).not.toContainText(
    "Library weekend hours",
  );
});

test("user CRUD, roles and author relation guard", async ({ page }) => {
  await login(page);
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Users" })
    .click();
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(4);
  await expect(page.getByRole("table")).toContainText("Staff");
  await page.getByRole("button", { name: /Add User/ }).click();
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("alert")).toContainText("Username");
  await page.getByLabel("Username").fill("newstaff");
  await page.getByLabel("Password").fill("demo123");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("table")).toContainText("newstaff");
  await page.getByRole("textbox", { name: "Search users" }).fill("NEWSTAFF");
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(2);
  await page.getByRole("button", { name: "Edit newstaff" }).click();
  await page.getByLabel("Role").selectOption("1");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("table")).toContainText("Admin");
  await page
    .getByRole("textbox", { name: "Search users" })
    .fill("no-user-match");
  await expect(page.getByText("No matching results")).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).last().click();
  await page.getByRole("button", { name: "Delete newstaff" }).click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Cancel" })
    .click();
  await expect(page.getByRole("table")).toContainText("newstaff");
  await page.getByRole("button", { name: "Delete newstaff" }).click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Delete" })
    .click();
  await expect(page.getByRole("table")).not.toContainText("newstaff");
  await page.getByRole("button", { name: "Delete Admin" }).click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Delete" })
    .click();
  await expect(page.getByRole("alert")).toContainText("author");
});

test("empty collections and missing relations show feedback without crashing", async ({
  page,
}) => {
  await login(page);
  await page.evaluate(() =>
    localStorage.setItem(
      "funews-assignment-01-data",
      JSON.stringify({ categories: [], news: [], users: [] }),
    ),
  );
  await page.reload();
  for (const [menu, heading] of [
    ["Category", "categories"],
    ["News", "news"],
    ["Users", "users"],
  ]) {
    await page
      .getByRole("navigation")
      .getByRole("button", { name: menu })
      .click();
    await expect(page.getByText(`No ${heading} yet`)).toBeVisible();
  }
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "News" })
    .click();
  await page.getByRole("button", { name: /Add News article/ }).click();
  await page.getByLabel("Title").fill("Article without relation");
  await page.getByLabel("Content").fill("Some content");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("alert")).toContainText("valid category");
});

test("mobile layout remains usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "News" })
    .click();
  await expect(
    page.getByRole("heading", { name: "News", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: "evidence/news-mobile.png", fullPage: true });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});
