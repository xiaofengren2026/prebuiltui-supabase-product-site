import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/lib/database.types";

type SessionPayload = {
  access_token?: string;
  refresh_token?: string;
};

export async function POST(request: Request) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL;

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    return NextResponse.json({ error: "Supabase URL missing" }, { status: 500 });
  }

  if (!supabaseAnonKey) {
    return NextResponse.json({ error: "Supabase anon key missing" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const response = NextResponse.json({ ok: true });
  const cookiesToWrite: Array<{
    name: string;
    value: string;
    options?: Record<string, unknown>;
  }> = [];
  const isSecure = request.url.startsWith("https://");
  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookiesToWrite.push({
            name,
            value,
            options,
          });
        });
      },
    },
  });

  const { access_token, refresh_token } = (await request.json().catch(() => ({}))) as SessionPayload;

  if (!access_token || !refresh_token) {
    return NextResponse.json(
      { error: "Missing access_token or refresh_token" },
      { status: 400 },
    );
  }

  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  cookiesToWrite.forEach(({ name, value, options }) => {
    response.cookies.set({
      name,
      value,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: isSecure,
      ...(options ?? {}),
    });
  });

  return response;
}
