import type { ReactNode } from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";

type AdminShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AdminShell({ title, description, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background-soft/60">
      <div className="container-shell grid gap-6 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="section-card h-fit px-5 py-6">
          <p className="font-serif text-2xl text-foreground">网站后台</p>
          <p className="mt-2 text-sm leading-7 text-foreground-muted">
            管理产品、首页文案、联系方式和图片。
          </p>
          <div className="mt-6">
            <AdminNav />
          </div>
        </aside>

        <main className="grid gap-6">
          <section className="section-card flex flex-col gap-5 px-6 py-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="font-serif text-3xl text-foreground">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground-muted">
                {description}
              </p>
            </div>
            <LogoutButton />
          </section>

          {children}
        </main>
      </div>
    </div>
  );
}
