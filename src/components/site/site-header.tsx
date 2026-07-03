import Link from "next/link";

import { SITE_NAV_ITEMS } from "@/lib/constants";

type SiteHeaderProps = {
  brandName: string;
};

export function SiteHeader({ brandName }: SiteHeaderProps) {
  const navItems = SITE_NAV_ITEMS.map((item) => {
    if (item.href === "/#products") {
      return { ...item, href: "/products" };
    }

    if (item.href === "/#contact") {
      return { ...item, href: "/contact" };
    }

    return item;
  });

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="container-shell flex h-18 items-center justify-between gap-5 py-4">
        <Link href="/" className="font-serif text-xl tracking-[0.16em] text-foreground">
          {brandName}
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-foreground-muted md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className="secondary-button px-4 py-2 text-sm">
          联系我们
        </Link>
      </div>
    </header>
  );
}
