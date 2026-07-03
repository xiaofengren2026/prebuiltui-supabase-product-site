import type { SiteSettings } from "@/lib/types";

type SiteFooterProps = {
  settings: SiteSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  return (
    <footer className="mt-20 border-t border-border/80 bg-surface/70">
      <div className="container-shell py-12">
        <div className="max-w-3xl">
          <p className="font-serif text-2xl text-foreground">
            {settings.brand_name || "青岚"}
          </p>
          <p className="mt-4 text-sm leading-7 text-foreground-muted">
            青岚东方｜东方之美，日常之礼。愿每一件小物，都带来一份安定、顺遂与好运。
          </p>
        </div>

        <p className="mt-8 text-xs tracking-[0.12em] text-foreground-muted">© 青岚东方</p>
      </div>
    </footer>
  );
}
