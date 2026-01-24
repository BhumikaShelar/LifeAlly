import client from "./client";

export async function fetchUsers(params?: { page?: number; per_page?: number }) {
  const r = await client.get("/admin/users", { params });
  return r.data;
}

export async function fetchQueries(params?: { page?: number; per_page?: number }) {
  const r = await client.get("/admin/queries", { params });
  return r.data;
}

export async function deleteUser(userId: number) {
  const r = await client.delete(`/admin/user/${userId}`);
  return r.data;
}