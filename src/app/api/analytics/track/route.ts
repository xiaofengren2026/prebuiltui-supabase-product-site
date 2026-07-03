import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database.types";
import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/supabase/env";

type TrackPayload = {
  path?: string;
  page_type?: string;
  product_id?: string | null;
  product_name?: string | null;
  visitor_id?: string;
  user_agent?: string | null;
  referrer?: string | null;
};

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ error: "Supabase environment variables are missing." }, { status: 503 });
  }

  let payload: TrackPayload;

  try {
    payload = (await request.json()) as TrackPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const path = payload.path?.trim();
  const pageType = payload.page_type?.trim();
  const visitorId = payload.visitor_id?.trim();

  if (!path || !pageType || !visitorId) {
    return NextResponse.json(
      { error: "Missing path, page_type, or visitor_id." },
      { status: 400 },
    );
  }

  const { url, anonKey } = getSupabaseEnv();
  const supabase = createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  const userAgent = payload.user_agent?.trim() || request.headers.get("user-agent");
  const referrer = payload.referrer?.trim() || request.headers.get("referer");

  const { error } = await supabase.from("page_views").insert({
    path,
    page_type: pageType,
    product_id: payload.product_id?.trim() || null,
    product_name: payload.product_name?.trim() || null,
    visitor_id: visitorId,
    user_agent: userAgent || null,
    referrer: referrer || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
