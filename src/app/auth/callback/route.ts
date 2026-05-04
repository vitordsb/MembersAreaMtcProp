import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Callback de confirmação de email e OAuth.
 * Troca o `code` pela sessão do Supabase.
 *
 * - Confirmação de email (type=email): faz signOut após confirmar e redireciona
 *   para /login?confirmed=true — o usuário precisa fazer login manualmente.
 * - OAuth / outros: redireciona para `next` (default /dashboard) já logado.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const type = searchParams.get("type"); // Supabase passa type=email para confirmação

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  // Confirmação de email: desloga e envia para o login com aviso de sucesso.
  const isEmailConfirmation = type === "email" || next === "/login" || next.includes("confirmed");
  if (isEmailConfirmation) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?confirmed=true`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
