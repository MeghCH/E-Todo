const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export async function login(payload) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.msg || "Impossible de se connecter.");
  }

  const data = await res.json();

  if (data?.token) {
    localStorage.setItem("access_token", data.token);
  }

  if (data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
}
