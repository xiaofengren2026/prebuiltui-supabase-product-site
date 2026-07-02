import { redirect } from "next/navigation";

import { getCurrentUser, isAdminEmail } from "@/lib/auth";

export default async function AdminIndexPage() {
  const user = await getCurrentUser();

  if (user && isAdminEmail(user.email)) {
    redirect("/admin/dashboard");
  }

  redirect("/admin/login");
}
