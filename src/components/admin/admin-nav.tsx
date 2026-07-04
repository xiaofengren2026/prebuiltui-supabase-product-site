"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const EXTRA_NAV_ITEMS = [
  { label: "订单管理", href: "/admin/orders" },
  { label: "数据统计", href: "/admin/analytics" },
];

export function AdminNav() {
  const pathname = usePathname();
  const items = [...ADMIN_NAV_ITEMS, ...EXTRA_NAV_ITEMS];

  return (
    <nav className="grid gap-2">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-2xl px-4 py-3 text-sm transition",
              active
                ? "bg-accent text-button-text"
                : "text-foreground-muted hover:bg-white/25 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
