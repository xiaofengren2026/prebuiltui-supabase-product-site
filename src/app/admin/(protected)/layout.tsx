import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminUser } from "@/lib/auth";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  await requireAdminUser();

  return (
    <AdminShell
      title="网站后台"
      description="这里是后台管理区。你可以继续管理产品、订单、图片和首页文案。"
    >
      {children}
    </AdminShell>
  );
}
