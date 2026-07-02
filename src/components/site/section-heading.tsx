type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left";

  return (
    <div className={`flex flex-col ${alignClass}`}>
      <span className="section-label">{label}</span>
      <h2 className="mt-5 max-w-3xl font-serif text-3xl leading-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-base leading-8 text-foreground-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
