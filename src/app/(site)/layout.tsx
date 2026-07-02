import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getSiteSettings } from "@/lib/site-data";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <div className="grain-overlay">
      <SiteHeader brandName={settings.brand_name} />
      {children}
      <SiteFooter settings={settings} />
    </div>
  );
}
