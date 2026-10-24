import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * E-posta doğrulama bağlantısının açtığı yol.
 * Supabase e-posta şablonu şu biçimde link üretmeli:
 *   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
 * Başarılıysa oturum çerezleri kurulur ve kullanıcı panele yönlendirilir.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/panel";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Geçersiz/eksik bağlantı → giriş sayfasına
  return NextResponse.redirect(`${origin}/giris?hata=dogrulama`);
}
