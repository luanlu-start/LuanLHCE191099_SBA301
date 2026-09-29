# Assignment 01 test matrix

Actual results below were verified with `npm run test:e2e` in Microsoft Edge and `npm test` on 29 September 2026. All browser tests use a fresh context, so each starts with the same seed records. `Pass` means the expected behavior was asserted in automated tests; the test file is `tests/e2e.spec.js` unless noted.

| #   | Area          | Action / expected result                                          | Actual |
| --- | ------------- | ----------------------------------------------------------------- | ------ |
| 1   | Login         | Submit empty fields; validation shown, remain on login            | Pass   |
| 2   | Login         | Wrong password; error shown, remain on login                      | Pass   |
| 3   | Login         | Admin/Admin opens dashboard                                       | Pass   |
| 4   | Auth          | Logout returns to login; reload stays logged out                  | Pass   |
| 5   | Layout        | Sidebar has all five menu items                                   | Pass   |
| 6   | Navigation    | Each menu shows its corresponding view                            | Pass   |
| 7   | Category      | Seed categories appear in table                                   | Pass   |
| 8   | Category      | Valid create adds a record                                        | Pass   |
| 9   | Category      | Blank/duplicate name is rejected                                  | Pass   |
| 10  | Category      | Edit changes the selected record                                  | Pass   |
| 11  | Category      | Cancel delete preserves the record                                | Pass   |
| 12  | Category      | Confirm delete removes the record                                 | Pass   |
| 13  | Category      | Mixed-case keyword with spaces finds the record                   | Pass   |
| 14  | Category      | Missing keyword displays no-result state                          | Pass   |
| 15  | News          | Seed articles appear in table                                     | Pass   |
| 16  | News          | Valid create adds a record                                        | Pass   |
| 17  | News          | Blank title is rejected                                           | Pass   |
| 18  | News          | Edit changes the selected article                                 | Pass   |
| 19  | News          | Cancel delete preserves the article                               | Pass   |
| 20  | News          | Confirm delete removes the article                                | Pass   |
| 21  | News          | Keyword finds the relevant article                                | Pass   |
| 22  | News          | Missing keyword displays no-result state                          | Pass   |
| 23  | Users         | Seed accounts appear in table                                     | Pass   |
| 24  | Users         | Valid create adds an account                                      | Pass   |
| 25  | Users         | Blank username is rejected                                        | Pass   |
| 26  | Users         | Edit changes the selected account role                            | Pass   |
| 27  | Users         | Cancel delete preserves the account                               | Pass   |
| 28  | Users         | Confirm delete removes the account                                | Pass   |
| 29  | Users         | Mixed-case username search finds the account                      | Pass   |
| 30  | Users         | Missing keyword displays no-result state                          | Pass   |
| 31  | News relation | Article uses a valid category and displays its name               | Pass   |
| 32  | User role     | Role labels display Admin and Staff                               | Pass   |
| 33  | Status        | Status labels display Active and Inactive                         | Pass   |
| 34  | Empty state   | Empty collections display a message; missing relation is rejected | Pass   |
| 35  | Persistence   | Refresh retains data and the current session                      | Pass   |

Additional checks: `tests/records.test.js` contains five passing logic tests; the Edge suite contains six passing browser tests including a 390-pixel mobile viewport. The production build succeeded and `npm audit --audit-level=moderate` reported zero vulnerabilities.

Evidence images: `evidence/login.png`, `evidence/login-error.png`, `evidence/dashboard.png`, `evidence/categories.png`, `evidence/category-dialog.png`, `evidence/news-mobile.png`.
