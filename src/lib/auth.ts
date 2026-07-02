import "server-only";

import { redirect } from "next/navigation";

import { getAdminEmail } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export function isAdminEmail(email?: string | null) {
  const adminEmail = getAdminEmail();

  return Boolean(adminEmail && email && email.toLowerCase() === adminEmail);
}

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAdminUser() {
  const user = await getCurrentUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin/login");
  }

  return user;
}
