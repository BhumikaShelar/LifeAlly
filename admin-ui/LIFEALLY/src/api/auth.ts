import client from "./client";

export async function login(email: string, password: string) {
  const r = await client.post("/auth/login", { email, password });
  if (r.data && r.data.user_id) {
    sessionStorage.setItem("adminUserId", String(r.data.user_id));
  }
  return r.data;
}

export function logout() {
  sessionStorage.removeItem("adminUserId");
}