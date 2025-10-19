// Caminho do Ficheiro: src/features/crm/pages/deals-page.tsx
// Versão Final e Recriada

import { useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { DealBoard } from '@/features/crm/components/deal-board';
import { DealToolbar } from '@/features/crm/components/deal-toolbar';
import { DealList } from '@/features/crm/components/deal-list';
import { useCRMStore } from '@/features/crm/stores/crm-store';
import type { Deal, DealStage, Client } from '@/features/crm/types';
import { formatCurrency } from '@/lib/utils';

// --- Tipos Específicos para esta Página ---

type Totals = {
  totalValue: number;
  totalCount: number;
  winRate: number;
  averageTicket: number;
  wonCount: number;
  lostCount: number;
};

type UseDealsDataReturn = {
  clients: Client[];
  onMoveDeal: (dealId: string, fromStage: DealStage, toStage: DealStage, newIndex: number) => void;
  onReorderDeal: (stage: DealStage, oldIndex: number, newIndex: number) => void;
  filteredDeals: Deal[];
  filteredOrder: Record<DealStage, string[]>;
  totals: Totals;
};

type ViewMode = 'kanban' | 'list';

type DealsDataArgs = {
  searchTerm: string;
  stageFilter: DealStage | 'all';
};

// --- Hook Customizado para Lógica de Dados ---

function useDealsData({ searchTerm, stageFilter }: DealsDataArgs): UseDealsDataReturn {
  const { deals, clients, dealOrder, moveDeal, reorderDeal } = useCRMStore(
    (state) => ({
      deals: state.deals,
      clients: state.clients,
      dealOrder: state.dealOrder,
      moveDeal: state.moveDeal,
      reorderDeal: state.reorderDeal,
    }),
    shallow, // Essencial para evitar loops de renderização
  );

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filteredDeals = deals.filter((deal) => {
      const matchesStage = stageFilter === 'all' || deal.stage === stageFilter;
      if (!matchesStage) return false;
      if (term.length === 0) return true;
      const client = clients.find((item) => item.id === deal.clientId);
      return (
        deal.title.toLowerCase().includes(term) ||
        deal.owner.toLowerCase().includes(term) ||
        client?.name.toLowerCase().includes(term) ||
        client?.company.toLowerCase().includes(term)
      );
    });

    const filteredIds = new Set(filteredDeals.map((deal) => deal.id));
    const stageList = Object.keys(dealOrder) as DealStage[];
    const filteredOrder = stageList.reduce((acc, stage) => {
      const ids = dealOrder[stage];
      acc[stage] =
        stageFilter !== 'all' && stageFilter !== stage
          ? []
          : ids.filter((id) => filteredIds.has(id));
      return acc;
    }, Object.fromEntries(stageList.map((stage) => [stage, [] as string[]])) as typeof dealOrder);

    return {
      filteredDeals,
      filteredOrder,
      totals: calculateTotals(filteredDeals),
    };
  }, [clients, dealOrder, deals, searchTerm, stageFilter]);

  return {
    clients,
    onMoveDeal: moveDeal,
    onReorderDeal: reorderDeal,
    filteredDeals: filtered.filteredDeals,
    filteredOrder: filtered.filteredOrder,
    totals: filtered.totals,
  };
}

// --- Componente Principal da Página ---

export function DealsPage() {
  const [view, setView] = useState<ViewMode>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<DealStage | 'all'>('all');

  const {
    clients,
    onMoveDeal,
    onReorderDeal,
    filteredDeals,
    filteredOrder,
    totals,
  } = useDealsData({ searchTerm, stageFilter });

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Valor total no funil"
          value={formatCurrency(totals.totalValue)}
          helpText={`${totals.totalCount} negócios ativos`}
        />
        <StatCard
          title="Taxa de ganho"
          value={`${totals.winRate.toFixed(1)}%`}
          helpText={`${totals.wonCount} ganhos, ${totals.lostCount} perdidos`}
        />
        <StatCard
          title="Ticket médio"
          value={formatCurrency(totals.averageTicket)}
          helpText="Com base nos negócios ativos"
        />
      </section>

      <DealToolbar
        view={view}
        onChangeView={setView}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        stageFilter={stageFilter}
        onStageFilterChange={setStageFilter}
      />

      {view === 'kanban' ? (
        <DealBoard
          deals={filteredDeals}
          dealOrder={filteredOrder}
          clients={clients}
          onMoveDeal={onMoveDeal}
          onReorderDeal={onReorderDeal}
        />
      ) : (
        <DealList
          deals={filteredDeals}
          clientsById={clients.reduce<Record<string, Client>>(
            (map, client) => {
              map[client.id] = client;
              return map;
            },
            {},
          )}
        />
      )}
    </div>
  );
}

// --- Componentes e Funções Auxiliares ---

function calculateTotals(deals: Deal[]): Totals {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const totalCount = deals.length;
  const wonDeals = deals.filter((deal) => deal.stage === 'won');
  const lostDeals = deals.filter((deal) => deal.stage === 'lost');
  const winRate = totalCount === 0 ? 0 : (wonDeals.length / totalCount) * 100;
  const averageTicket = totalCount === 0 ? 0 : totalValue / totalCount;
  return {
    totalValue,
    totalCount,
    winRate,
    averageTicket,
    wonCount: wonDeals.length,
    lostCount: lostDeals.length,
  };
}

type StatCardProps = {
  title: string;
  value: string;
  helpText: string;
};

function StatCard({ title, value, helpText }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600 dark:text-primary-300">
        {title}
      </p>
      <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </h3>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {helpText}
      </p>
    </div>
  );
}