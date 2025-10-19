// Caminho do Ficheiro: src/features/crm/stores/crm-store.ts
// VERSÃO FINAL E CORRIGIDA

import { create } from 'zustand';
import type { Deal, DealStage, Client } from '../types';

// A interface que define a "forma" da nossa store.
interface CRMState {
  deals: Deal[];
  clients: Client[];
  dealOrder: Record<DealStage, string[]>;
  moveDeal: (dealId: string, fromStage: DealStage, toStage: DealStage, newIndex: number) => void;
  reorderDeal: (stage: DealStage, oldIndex: number, newIndex: number) => void;
}

// A CORREÇÃO CRÍTICA ESTÁ AQUI: create<CRMState>((set) => ({ ... }))
// Adicionamos <CRMState> para ligar a interface à store.
export const useCRMStore = create<CRMState>((set) => ({
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
  moveDeal: (dealId, fromStage, toStage, newIndex) => {
    set((state) => {
      const newDealOrder = { ...state.dealOrder };
      newDealOrder[fromStage] = newDealOrder[fromStage].filter((id) => id !== dealId);
      newDealOrder[toStage].splice(newIndex, 0, dealId);
      const newDeals = state.deals.map((deal) =>
        deal.id === dealId ? { ...deal, stage: toStage } : deal,
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