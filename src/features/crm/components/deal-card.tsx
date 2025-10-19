import { useMemo } from 'react';
import {
  CalendarDaysIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import type { Deal, Client } from '@/features/crm/types';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency, formatRelativeDate } from '@/lib/utils';

type DealCardProps = {
  deal: Deal;
  client: Client | undefined;
  isDragging?: boolean;
};

export function DealCard({ deal, client, isDragging }: DealCardProps) {
  const probabilityVariant = useMemo(() => {
    if (deal.probability >= 75) {
      return 'success';
    }
    if (deal.probability <= 25) {
      return 'warning';
    }
    return 'outline';
  }, [deal.probability]);

  return (
    <article
      className={cn(
        'space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900',
        isDragging && 'border-primary-300 shadow-lg ring-2 ring-primary-200',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {deal.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Atualizado {formatRelativeDate(deal.updatedAt)}
          </p>
        </div>
        <Badge variant="default">{formatCurrency(deal.value)}</Badge>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <UserIcon className="h-4 w-4" />
        <span>{client?.name ?? 'Cliente não identificado'}</span>
        <span className="text-slate-300 dark:text-slate-600">•</span>
        <span>{deal.owner}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {deal.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <Badge variant={probabilityVariant}>
          Probabilidade {deal.probability}%
        </Badge>
        {deal.dueDate && (
          <div className="flex items-center gap-1.5">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>Fechamento {deal.dueDate}</span>
          </div>
        )}
      </div>
    </article>
  );
}

