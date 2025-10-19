// Caminho: src/features/crm/components/deal-column.tsx

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Deal, DealStage, Client } from '@/features/crm/types';
import { cn, formatCurrency } from '@/lib/utils';
import { DealSortableCard } from '@/features/crm/components/deal-sortable-card';

type DealColumnProps = {
  stage: DealStage;
  title: string; // Recebe o título via props
  deals: Deal[];
  clientsById: Record<string, Client>;
};

export function DealColumn({ stage, title, deals, clientsById }: DealColumnProps) {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const { setNodeRef, isOver } = useDroppable({ id: stage, data: { type: 'column' } });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex min-w-[280px] flex-col gap-4 rounded-3xl bg-slate-100/70 p-4 transition dark:bg-slate-900/40',
        isOver && 'border-2 border-dashed border-primary-300 bg-primary-50/40 dark:border-primary-400/60',
      )}
    >
      <header className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {title}
          </h3>
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            {deals.length}
          </span>
        </div>
        <p className="text-xs font-medium text-primary-600 dark:text-primary-300">
          {formatCurrency(totalValue)}
        </p>
      </header>
      <SortableContext
        id={stage}
        items={deals.map((deal) => deal.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-1 flex-col gap-3">
          {deals.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Arraste deals para esta coluna
            </div>
          ) : (
            deals.map((deal) => (
              <DealSortableCard
                key={deal.id}
                deal={deal}
                client={clientsById[deal.clientId]}
                stage={stage}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}