// Caminho: src/features/crm/components/deal-board.tsx

import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import type { Client, Deal, DealStage } from '@/features/crm/types';
import { DealColumn } from '@/features/crm/components/deal-column';
import { DealCard } from '@/features/crm/components/deal-card';
import { createPortal } from 'react-dom';

type DealBoardProps = {
  deals: Deal[];
  dealOrder: Record<DealStage, string[]>;
  clients: Client[];
  onMoveDeal: (dealId: string, fromStage: DealStage, toStage: DealStage, newIndex: number) => void;
  onReorderDeal: (stage: DealStage, oldIndex: number, newIndex: number) => void;
};

const STAGES_CONFIG: Record<DealStage, string> = {
  prospecting: 'Prospecting',
  qualification: 'Qualification',
  proposal: 'Proposta',
  negotiation: 'Negociação',
  won: 'Ganhos',
  lost: 'Perdidos',
};

export function DealBoard({
  deals,
  dealOrder,
  clients,
  onMoveDeal,
  onReorderDeal,
}: DealBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const clientsById = useMemo(() => {
    return clients.reduce<Record<string, Client>>((map, client) => {
      map[client.id] = client;
      return map;
    }, {});
  }, [clients]);

  const dealsById = useMemo(() => new Map(deals.map((deal) => [deal.id, deal])), [deals]);

  function findStageOfDeal(dealId: string): DealStage | undefined {
    for (const stage in dealOrder) {
      if (dealOrder[stage as DealStage].includes(dealId)) {
        return stage as DealStage;
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over || !active || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeStage = findStageOfDeal(activeId);
    const overIsColumn = over.data.current?.type === 'column';
    const overStage = overIsColumn
      ? (over.id as DealStage)
      : findStageOfDeal(overId);

    if (!activeStage || !overStage) return;

    if (activeStage === overStage) {
      const oldIndex = dealOrder[activeStage].indexOf(activeId);
      const newIndex = dealOrder[activeStage].indexOf(overId);
      if (oldIndex !== newIndex) {
        onReorderDeal(activeStage, oldIndex, newIndex);
      }
    } else {
      const newIndex = overIsColumn
        ? dealOrder[overStage].length
        : dealOrder[overStage].indexOf(overId);
      onMoveDeal(activeId, activeStage, overStage, newIndex);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const deal = dealsById.get(String(event.active.id));
    if (deal) setActiveDeal(deal);
  };

  const stages = Object.keys(dealOrder) as DealStage[];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <section className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <DealColumn
            key={stage}
            stage={stage}
            title={STAGES_CONFIG[stage]}
            deals={dealOrder[stage].map(id => dealsById.get(id)).filter((d): d is Deal => !!d)}
            clientsById={clientsById}
          />
        ))}
      </section>

      {createPortal(
        <DragOverlay dropAnimation={null}>
          {activeDeal ? (
            <DealCard
              deal={activeDeal}
              client={clientsById[activeDeal.clientId]}
              isDragging
            />
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}