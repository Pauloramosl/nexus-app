import { useMemo, useState } from 'react';
import { useCRMStore } from '@/features/crm/stores/crm-store';
import type { ClientStatus } from '@/features/crm/types';
import { ClientTable } from '@/features/crm/components/client-table';
import { formatCurrency } from '@/lib/utils';

export function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');

  const { clients, deals } = useCRMStore((state) => ({
    clients: state.clients,
    deals: state.deals,
  }));

  const stats = useMemo(() => {
    const total = clients.length;
    const active = clients.filter((client) => client.status === 'ativo').length;
    const potential = clients.filter((client) => client.status === 'potencial').length;
    const inactive = clients.filter((client) => client.status === 'inativo').length;

    const valuePerClient = deals.reduce<Record<string, number>>((acc, deal) => {
      acc[deal.clientId] = (acc[deal.clientId] ?? 0) + deal.value;
      return acc;
    }, {});

    const averageRevenue =
      total === 0
        ? 0
        : Object.values(valuePerClient).reduce((sum, value) => sum + value, 0) / total;

    return { total, active, potential, inactive, averageRevenue };
  }, [clients, deals]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <ClientStat title="Clientes" value={String(stats.total)} helpText="Total na base" />
        <ClientStat title="Ativos" value={String(stats.active)} helpText="Projetos em andamento" />
        <ClientStat
          title="Potenciais"
          value={String(stats.potential)}
          helpText="Em negociação e oportunidades"
        />
        <ClientStat
          title="Ticket médio"
          value={formatCurrency(stats.averageRevenue)}
          helpText="Valor médio por cliente"
        />
      </section>

      <ClientTable
        clients={clients}
        deals={deals}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchTermChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
      />
    </div>
  );
}

type ClientStatProps = {
  title: string;
  value: string;
  helpText: string;
};

function ClientStat({ title, value, helpText }: ClientStatProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600 dark:text-primary-300">
        {title}
      </p>
      <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{helpText}</p>
    </div>
  );
}
