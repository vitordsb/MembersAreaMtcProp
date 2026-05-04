import { createSupabaseServerClient } from "@/lib/supabase/server";

// Server-side: usa hostname interno do docker-compose. Em dev local sem docker, cai pro NEXT_PUBLIC_API_URL.
const API_URL =
  process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3301/api";

/**
 * Wrapper para chamadas autenticadas ao backend Nest.
 * Usa em Server Components — pega o JWT do Supabase do cookie e injeta como Bearer.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}
