export type LegalSection = {
  heading: string;
  body: React.ReactNode;
};

export default function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="bg-cream text-ink">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 pb-24">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-signal" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-dark font-semibold">
            Legal
          </p>
        </div>
        <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] text-ink leading-[1.05]">
          {title}
        </h1>
        <p className="mt-3 text-sm text-ink-soft">Last updated: {updated}</p>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-xl font-bold tracking-tight text-ink">
                {section.heading}
              </h2>
              <div className="mt-3 text-[15px] leading-relaxed text-ink-soft space-y-3">
                {section.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
