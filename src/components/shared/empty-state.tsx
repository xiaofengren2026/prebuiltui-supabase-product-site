type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="section-card px-6 py-10 text-center">
      <h3 className="font-serif text-2xl text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-foreground-muted">{description}</p>
    </div>
  );
}
