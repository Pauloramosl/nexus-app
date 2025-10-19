import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { DealCard } from '@/features/crm/components/deal-card';
import type { Deal, Client, DealStage } from '@/features/crm/types';

type DealSortableCardProps = {
  deal: Deal;
  client?: Client;
  stage: DealStage;
};

export function DealSortableCard({ deal, client, stage }: DealSortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: deal.id,
      data: {
        deal,
        stage,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DealCard deal={deal} client={client} isDragging={isDragging} />
    </div>
  );
}
