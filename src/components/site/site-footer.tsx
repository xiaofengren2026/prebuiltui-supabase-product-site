import type { SiteSettings } from "@/lib/types";

type SiteFooterProps = {
  settings: SiteSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  return (
    <footer className="mt-16 border-t border-border/80 bg-surface/70">
      <div className="container-shell py-8">
        <p className="text-left text-xs tracking-[0.12em] text-foreground-muted">
          © 青岚东方
        </p>
      </div>
    </footer>
  );
}
