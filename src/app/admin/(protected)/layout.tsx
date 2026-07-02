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
      description="这里是后台管理区。前台只负责展示，后续改产品、图片和首页文案主要都在这里完成。"
    >
      {children}
    </AdminShell>
  );
}
