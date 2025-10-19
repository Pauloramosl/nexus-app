import { cn } from '@/lib/utils';

type Option = {
  label: string;
  value: string;
};

type TaskCalendarFiltersProps = {
  owners: Option[];
  projects: Option[];
  value: {
    owner: string;
    projectId: string;
  };
  onChange: (filters: { owner: string; projectId: string }) => void;
};

export function TaskCalendarFilters({
  owners,
  projects,
  value,
  onChange,
}: TaskCalendarFiltersProps) {
  return (
    <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3">
      <FilterSelect
        label="Responsável"
        value={value.owner}
        onChange={(owner) => onChange({ ...value, owner })}
        options={[{ label: 'Todos', value: 'all' }, ...owners]}
      />
      <FilterSelect
        label="Projeto"
        value={value.projectId}
        onChange={(projectId) => onChange({ ...value, projectId })}
        options={[{ label: 'Todos', value: 'all' }, ...projects]}
      />
      <div className="flex flex-col justify-center rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500 dark:bg-slate-900/60 dark:text-slate-300">
        <p className="font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
          Dica
        </p>
        <p className="mt-1">
          Clique em uma tarefa no calendário para visualizar detalhes, checklist
          e acompanhar o andamento completo.
        </p>
      </div>
    </div>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'mt-1 block w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-600',
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
