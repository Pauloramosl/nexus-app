// Caminho: src/features/crm/types.ts

// Garantimos que os nomes dos estágios são os mesmos usados na store
export type DealStage =
  | 'prospecting'
  | 'qualification'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

export type Deal = {
  id: string;
  title: string;
  clientId: string;
  value: number;
  stage: DealStage;
  owner: string;
  // Adicionei os campos que você tinha no seu tipo original
  probability: number;
  tags: string[];
  updatedAt: string;
  dueDate?: string;
  description?: string;
};

export type ClientStatus = 'ativo' | 'potencial' | 'inativo';

export type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  // Adicionei os campos que você tinha no seu tipo original
  phone: string;
  status: ClientStatus;
  deals: string[];
  createdAt: string;
  industry?: string;
  notes?: string;
};