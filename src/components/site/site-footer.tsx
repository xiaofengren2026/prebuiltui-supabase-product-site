import Link from "next/link";

import type { SiteSettings } from "@/lib/types";

type SiteFooterProps = {
  settings: SiteSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const links = [
    {
      label: "Instagram",
      href: settings.instagram_url,
    },
    {
      label: "Kakao",
      href: settings.kakao_url,
    },
    {
      label: "WhatsApp",
      href: settings.whatsapp_url,
    },
  ].filter((item) => item.href);

  return (
    <footer className="mt-20 border-t border-border/80 bg-surface/70">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="font-serif text-2xl text-foreground">{settings.brand_name}</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground-muted">
            {settings.footer_text}
          </p>
        </div>

        <div className="grid gap-4 text-sm text-foreground-muted">
          <a href={`mailto:${settings.contact_email}`} className="transition hover:text-foreground">
            {settings.contact_email}
          </a>
          {links.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
