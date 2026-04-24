type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase text-amber-200">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-4xl font-semibold text-white sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 text-base leading-7 text-stone-300 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
