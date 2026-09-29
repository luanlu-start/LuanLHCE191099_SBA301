export const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

export function filterRecords(
  type,
  records,
  keyword,
  categories = [],
  users = [],
) {
  const query = normalize(keyword);
  if (!query) return records;
  return records.filter((item) => {
    const fields =
      type === "categories"
        ? [item.name]
        : type === "users"
          ? [item.username]
          : [
              item.title,
              item.content,
              item.tags,
              categories.find((category) => category.id === item.categoryId)
                ?.name,
              users.find((user) => user.id === item.createdBy)?.username,
            ];
    return fields.some((field) => normalize(field).includes(query));
  });
}

export function validateRecord(
  type,
  record,
  records,
  categories = [],
  users = [],
  editingId = null,
) {
  if (type === "categories") {
    if (!record.name?.trim()) return "Category name is required.";
    if (
      records.some(
        (item) =>
          item.id !== editingId &&
          normalize(item.name) === normalize(record.name),
      )
    ) {
      return "Category name already exists.";
    }
  }
  if (type === "users") {
    if (!record.username?.trim()) return "Username is required.";
    if (!record.password?.trim()) return "Password is required.";
    if (
      records.some(
        (item) =>
          item.id !== editingId &&
          normalize(item.username) === normalize(record.username),
      )
    ) {
      return "Username already exists.";
    }
    if (![1, 2].includes(Number(record.role))) return "Choose a valid role.";
  }
  if (type === "news") {
    if (!record.title?.trim()) return "News title is required.";
    if (!record.content?.trim()) return "News content is required.";
    if (!categories.some((item) => item.id === record.categoryId))
      return "Choose a valid category.";
    if (!users.some((item) => item.id === record.createdBy))
      return "Choose a valid author.";
  }
  if (![0, 1].includes(Number(record.status))) return "Choose a valid status.";
  return "";
}

export function deletionError(type, item, news) {
  if (
    type === "categories" &&
    news.some((article) => article.categoryId === item.id)
  ) {
    return "This category is used by news. Move or delete those articles first.";
  }
  if (
    type === "users" &&
    news.some((article) => article.createdBy === item.id)
  ) {
    return "This user is an author of news. Change or delete those articles first.";
  }
  return "";
}

export function nextId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}
