type ComingSoonProps = {
  title: string;
  description: string;
};

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <section className="flex w-full flex-col items-start justify-center rounded-3xl border border-dashed border-slate-300 bg-white/90 p-10 text-left shadow-inner dark:border-slate-700 dark:bg-slate-900/80">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500 dark:text-primary-300">
        Em breve
      </p>
      <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </section>
  );
}
