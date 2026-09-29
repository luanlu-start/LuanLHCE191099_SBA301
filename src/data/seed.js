export const seed = {
  categories: [
    { id: "category-1", name: "Campus Life", status: 1 },
    { id: "category-2", name: "Academic", status: 1 },
    { id: "category-3", name: "Events", status: 1 },
    { id: "category-4", name: "Announcements", status: 0 },
  ],
  users: [
    { id: "user-1", username: "Admin", password: "Admin", role: 1, status: 1 },
    {
      id: "user-2",
      username: "editor",
      password: "demo123",
      role: 2,
      status: 1,
    },
    {
      id: "user-3",
      username: "reporter",
      password: "demo123",
      role: 2,
      status: 0,
    },
  ],
  news: [
    {
      id: "news-1",
      title: "Welcome to the new semester",
      content:
        "A new semester begins with fresh learning opportunities for every student.",
      categoryId: "category-2",
      createdBy: "user-1",
      status: 1,
      tags: "semester, students",
    },
    {
      id: "news-2",
      title: "Campus volunteer day",
      content:
        "Students and staff are invited to join the campus volunteer day this Friday.",
      categoryId: "category-1",
      createdBy: "user-2",
      status: 1,
      tags: "campus, volunteer",
    },
    {
      id: "news-3",
      title: "Upcoming student workshop",
      content:
        "Register for the student workshop and meet this semester’s guest speakers.",
      categoryId: "category-3",
      createdBy: "user-2",
      status: 0,
      tags: "workshop, event",
    },
  ],
};
