# FUNews Management System

SBA301 Assignment 01 · ReactJS frontend · Project: `LuanLHCE191099_SBA301`

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Log in with **Admin / Admin** (case-sensitive).

Other commands:

```bash
npm run build
npm run preview
npm test
npm run test:e2e
```

The browser tests use the installed Microsoft Edge browser. If Edge is unavailable, change the Playwright channel in `playwright.config.js` to an installed Chromium browser.

## Features

- Login validation, admin-only view, logout, and session restoration within the same browser session.
- Shared header/sidebar layout with Dashboard, Category, News, Users, and Settings.
- Create, read, update, delete, and search for categories, news, and users.
- Create/update forms in dialogs, delete confirmation, validation, empty and no-result states.
- News references an existing category and author. Categories/authors used by news cannot be deleted until their articles are moved or deleted.
- Role labels: `1 = Admin`, `2 = Staff`. Status labels: `1 = Active`, `0 = Inactive`.
- Data persists in browser `localStorage`; login persists in `sessionStorage` until logout or browser session end.

## Project structure and design decisions

| Area             | Decision                                                                 | Reason                                                                              |
| ---------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Navigation       | `page` state in `App.jsx`                                                | Five views do not require URL routes; switching views does not reload the page.     |
| Data state       | One `data` object in `App.jsx`                                           | News needs category and user records; the shared parent keeps relations consistent. |
| Persistence      | `src/lib/storage.js` with seed fallback                                  | CRUD results survive refresh without a backend.                                     |
| CRUD dialogs     | One `ManagementPage` for each entity, selected item and create/edit mode | Shared behavior stays consistent, while each form has its own fields.               |
| Search           | Derived filtered list in `src/lib/records.js`                            | Source records remain intact when searching or clearing a keyword.                  |
| Delete relations | `deletionError` blocks referenced categories/authors                     | Prevents orphaned news records.                                                     |

Main files: `src/App.jsx` owns authentication and data; `src/components/LoginPage.jsx` contains the login form; `src/components/AdminLayout.jsx` contains the header/menu; `src/components/ManagementPage.jsx` contains CRUD dialogs and tables; `src/lib/records.js` contains search and validation; `src/data/seed.js` contains demo records.

## Verification

`npm test` checks search, validation, and relations. `npm run test:e2e` checks real browser flows for login, every menu, CRUD, search, confirmation, persistence, empty states, and a mobile viewport. `npm run build` verifies the production bundle. See [TEST_MATRIX.md](TEST_MATRIX.md) for the 35 assignment cases and actual outcomes. Screenshots are in `evidence/`.

## Limitations

- This is a frontend demonstration. `Admin / Admin` is hard-coded mock authentication, not production security. User passwords are mock values stored locally; never enter a real password.
- Data is private to each browser profile; there is no Spring Boot API or database.
- The assignment guide refers to a provided HTML/CSS template, but that template was not included with the supplied guide or found in the available SBA301 files. The layout was recreated specifically for this project.
- The app uses Google Fonts when online and falls back to system fonts offline.

## AI use and verification record

AI assistance was used to interpret the assignment guide, generate the original FUNews logo (`public/assets/funews-logo.png`), implement the React UI, and draft browser/unit tests. The logo prompt requested a simple abstract news mark in navy, blue, and coral with no text and a transparent background. The implementation request was to cover login, five admin views, CRUD/search for three entities, dialogs, confirmation, relations, and tests. Outputs were checked with `npm test`, `npm run test:e2e`, `npm run build`, `npm audit`, and desktop/mobile screenshot inspection. Source code and AI output should be reviewed and explained by the student before submission or interview.

During verification, two test locators matched more than one element (`Categories` and `Clear search`); the selectors were made specific and the full suite reran successfully. A mobile screenshot revealed the sidebar brand caption outside its narrow area; the caption was hidden at small widths and the mobile test reran successfully.
