import { create } from 'zustand';
// Certifique-se de que o caminho para os seus tipos está correto
import type { Deal, DealStage, Client } from '../types';

// 1. A Interface (o "contrato") que diz ao TypeScript a forma da nossa store.
// Se isto não estiver aqui, nada mais funciona.
interface CRMState {
  deals: Deal[];
  clients: Client[];
  dealOrder: Record<DealStage, string[]>;
  moveDeal: (dealId: string, fromStage: DealStage, toStage: DealStage, newIndex: number) => void;
  reorderDeal: (stage: DealStage, oldIndex: number, newIndex: number) => void;
}

// 2. A criação da store, usando a Interface <CRMState>.
// Esta linha é a que "ativa" os tipos para o resto da aplicação.
export const useCRMStore = create<CRMState>((set) => ({
  // Estado inicial
  deals: [],
  clients: [],
  dealOrder: {
    prospecting: [],
    qualification: [],
    proposal: [],
    negotiation: [],
    won: [],
    lost: [],
  },

  // Ações
  moveDeal: (dealId, fromStage, toStage, newIndex) => {
    set((state) => {
      const newDealOrder = { ...state.dealOrder };
      newDealOrder[fromStage] = newDealOrder[fromStage].filter((id) => id !== dealId);
      newDealOrder[toStage].splice(newIndex, 0, dealId);
      const newDeals = state.deals.map((deal) =>
        deal.id === dealId ? { ...deal, stage: toStage } : deal
      );
      return { dealOrder: newDealOrder, deals: newDeals };
    });
  },
  reorderDeal: (stage, oldIndex, newIndex) => {
    set((state) => {
      if (oldIndex === newIndex) return state;
      const newDealOrder = { ...state.dealOrder };
      const column = Array.from(newDealOrder[stage]);
      const [removed] = column.splice(oldIndex, 1);
      column.splice(newIndex, 0, removed);
      newDealOrder[stage] = column;
      return { dealOrder: newDealOrder };
    });
  },
}));