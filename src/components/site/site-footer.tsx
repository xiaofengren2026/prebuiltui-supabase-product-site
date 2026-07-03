import type { SiteSettings } from "@/lib/types";

type SiteFooterProps = {
  settings: SiteSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  return (
    <footer className="mt-16 border-t border-border/80 bg-surface/70">
      <div className="container-shell py-10 text-center">
        <p className="font-serif text-3xl text-foreground md:text-[2rem]">
          {settings.brand_name || "青岚东方"}
        </p>
      </div>
    </footer>
  );
}
