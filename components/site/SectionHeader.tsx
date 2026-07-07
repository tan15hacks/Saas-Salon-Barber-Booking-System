type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-black uppercase tracking-[0.28em] text-rosewood/70">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-espresso/65">{description}</p> : null}
    </div>
  );
}
