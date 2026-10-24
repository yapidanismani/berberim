import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Sunucu bileşenleri ve server action'lar için Supabase client.
 * Oturum çerezlerden okunur; böylece RLS giriş yapan kullanıcı olarak uygulanır.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component içinden çağrıldığında set engellenebilir;
          // middleware oturumu tazelediği için bu güvenle yoksayılır.
        }
      },
    },
  });
}
