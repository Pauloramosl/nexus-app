// Caminho do Ficheiro: src/features/crm/components/deal-list.tsx

import { useMemo, useState } from 'react';
import type { Client, Deal, DealStage } from '@/features/crm/types';
// REMOVEMOS a importação que estava a causar o erro
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatRelativeDate, cn } from '@/lib/utils';

// ADICIONAMOS a configuração dos títulos aqui dentro
const STAGES_CONFIG: Record<DealStage, string> = {
  prospecting: 'Prospecting',
  qualification: 'Qualification',
  proposal: 'Proposta',
  negotiation: 'Negociação',
  won: 'Ganhos',
  lost: 'Perdidos',
};

const sortOptions = [
  { id: 'updatedAt', label: 'Atualização recente' },
  { id: 'value', label: 'Maior valor' },
  { id: 'probability', label: 'Maior probabilidade' },
] as const;

type SortId = (typeof sortOptions)[number]['id'];

type DealListProps = {
  deals: Deal[];
  clientsById: Record<string, Client>;
};

export function DealList({ deals, clientsById }: DealListProps) {
  const [sortBy, setSortBy] = useState<SortId>('updatedAt');

  const sortedDeals = useMemo(() => {
    return [...deals].sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.value - a.value;
        case 'probability':
          return b.probability - a.probability;
        case 'updatedAt':
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });
  }, [deals, sortBy]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Ordenar por
        </p>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSortBy(option.id)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold transition',
                sortBy === option.id
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-900/60">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">
                Negócio
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">
                Cliente
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">
                Valor
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">
                Prob.
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">
                Etapa
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">
                Owner
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">
                Atualização
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {sortedDeals.map((deal) => {
              const client = clientsById[deal.clientId];
              return (
                <tr
                  key={deal.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {deal.title}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {deal.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {client?.name ?? 'Cliente não encontrado'}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {client?.company ?? '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-primary-600 dark:text-primary-300">
                    {formatCurrency(deal.value)}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {deal.probability}%
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default">
                      {/* USAMOS a nossa configuração local */}
                      {STAGES_CONFIG[deal.stage]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {deal.owner}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                    {formatRelativeDate(deal.updatedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}