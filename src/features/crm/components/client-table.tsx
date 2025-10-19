import { useMemo, useState } from 'react';
import type { Client, Deal } from '@/features/crm/types';
import { Badge } from '@/components/ui/badge';
import { cn, formatRelativeDate } from '@/lib/utils';

const statusLabels: Record<Client['status'], string> = {
  ativo: 'Ativo',
  potencial: 'Potencial',
  inativo: 'Inativo',
};

const statusVariant: Record<Client['status'], Parameters<typeof Badge>[0]['variant']> =
  {
    ativo: 'success',
    potencial: 'warning',
    inativo: 'outline',
  };

type ClientTableProps = {
  clients: Client[];
  deals: Deal[];
  searchTerm: string;
  statusFilter: Client['status'] | 'all';
  onSearchTermChange: (value: string) => void;
  onStatusFilterChange: (status: Client['status'] | 'all') => void;
};

export function ClientTable({
  clients,
  deals,
  searchTerm,
  statusFilter,
  onSearchTermChange,
  onStatusFilterChange,
}: ClientTableProps) {
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');

  const dealsByClient = useMemo(() => {
    return deals.reduce<Record<string, Deal[]>>((acc, deal) => {
      if (!acc[deal.clientId]) {
        acc[deal.clientId] = [];
      }
      acc[deal.clientId].push(deal);
      return acc;
    }, {});
  }, [deals]);

  const filteredClients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return clients
      .filter((client) => {
        const matchesStatus =
          statusFilter === 'all' || client.status === statusFilter;
        const matchesSearch =
          term.length === 0 ||
          client.name.toLowerCase().includes(term) ||
          client.company.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term);

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'createdAt') {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        return a.name.localeCompare(b.name, 'pt-BR');
      });
  }, [clients, searchTerm, statusFilter, sortBy]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
          <input
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Buscar cliente por nome, empresa ou e-mail..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-primary-500 dark:focus:ring-primary-600"
          />
          <div className="flex gap-2">
            {(['all', 'ativo', 'potencial', 'inativo'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onStatusFilterChange(status)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold transition',
                  statusFilter === status
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
                )}
              >
                {status === 'all' ? 'Todos' : statusLabels[status]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Ordenar por:</span>
          <button
            type="button"
            onClick={() => setSortBy('name')}
            className={cn(
              'rounded-full px-3 py-1 font-semibold transition',
              sortBy === 'name'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
            )}
          >
            Nome
          </button>
          <button
            type="button"
            onClick={() => setSortBy('createdAt')}
            className={cn(
              'rounded-full px-3 py-1 font-semibold transition',
              sortBy === 'createdAt'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
            )}
          >
            Mais recentes
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-900/60">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">
                Cliente
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">
                Status
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">
                Contato
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">
                Telefone
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">
                Negócios
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">
                Entrada
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredClients.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-slate-900 dark:text-white">
                      {client.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {client.company}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={statusVariant[client.status]}>
                    {statusLabels[client.status]}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {client.email}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {client.phone}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {dealsByClient[client.id]?.length ?? 0}
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                  {formatRelativeDate(client.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
