import type { ContactItem } from "@/lib/types";

type ContactCardsProps = {
  items: ContactItem[];
};

export function ContactCards({ items }: ContactCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) =>
        item.href ? (
          <a
            key={item.label}
            href={item.href}
            className="section-card px-5 py-5 transition hover:-translate-y-1"
          >
            <p className="text-xs tracking-[0.14em] text-foreground-muted uppercase">{item.label}</p>
            <p className="mt-3 break-all text-sm leading-7 text-foreground">{item.value}</p>
          </a>
        ) : (
          <div key={item.label} className="section-card px-5 py-5 opacity-85">
            <p className="text-xs tracking-[0.14em] text-foreground-muted uppercase">{item.label}</p>
            <p className="mt-3 break-all text-sm leading-7 text-foreground">{item.value}</p>
          </div>
        ),
      )}
    </div>
  );
}
