export function DashboardPage() {
  return (
    <div className="flex w-full flex-col gap-8">
      <section className="w-full rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-left shadow-inner dark:border-slate-700 dark:bg-slate-900/60">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500 dark:text-primary-300">
          Em construcao
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Os widgets de tarefas, compromissos, deals recentes e atividades da equipe serao renderizados aqui na proxima etapa.
        </p>
      </section>
    </div>
  );
}
