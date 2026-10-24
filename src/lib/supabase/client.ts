import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error(
    "Supabase ortam değişkenleri eksik. .env.local içinde NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlı olmalı.",
  );
}

// Herkese açık (anon/publishable) istemci — katalog okuma ve randevu oluşturma için.
// Hem sunucu hem istemci bileşenlerinde kullanılabilir.
export const supabase = createClient<Database>(url, key);
