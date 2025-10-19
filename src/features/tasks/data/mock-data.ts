import type { Project, Task } from '@/features/tasks/types';

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Portal Corporativo PixelWave',
    description:
      'Site institucional completo com CMS headless, suporte multilíngue e área do cliente.',
    status: 'active',
    dueDate: '2025-02-15',
    progress: 68,
    client: 'PixelWave Studio',
    owner: 'Mariana Lopes',
    color: '#2563eb',
    team: [
      { name: 'Mariana Lopes', role: 'PM' },
      { name: 'Lucas Nascimento', role: 'Dev Front' },
      { name: 'Carla Menezes', role: 'UI/UX' },
    ],
  },
  {
    id: 'project-2',
    name: 'App de Fidelidade Aurora',
    description:
      'Aplicativo mobile com gamificação, integração com CRM e notificações push segmentadas.',
    status: 'planning',
    dueDate: '2025-03-05',
    progress: 32,
    client: 'Aurora Apps',
    owner: 'Gabriela Souza',
    color: '#0ea5e9',
    team: [
      { name: 'Gabriela Souza', role: 'PM' },
      { name: 'João Henrique', role: 'Dev Mobile' },
      { name: 'Paula Martins', role: 'UX Research' },
    ],
  },
  {
    id: 'project-3',
    name: 'Lançamento GrowthSpark',
    description:
      'Campanha de marketing 360º com landing pages convertendo leads e automações de nurture.',
    status: 'active',
    dueDate: '2025-01-30',
    progress: 82,
    client: 'GrowthSpark Digital',
    owner: 'Bruno Lima',
    color: '#f97316',
    team: [
      { name: 'Bruno Lima', role: 'PM' },
      { name: 'Renata Alves', role: 'Copywriter' },
      { name: 'Diego Rocha', role: 'Designer' },
    ],
  },
  {
    id: 'project-4',
    name: 'Design System UXFlow',
    description:
      'Entrega de design system completo com tokens, biblioteca de componentes e guidelines.',
    status: 'delivered',
    dueDate: '2024-12-12',
    progress: 100,
    client: 'UXFlow Agency',
    owner: 'Camila Rocha',
    color: '#10b981',
    team: [
      { name: 'Camila Rocha', role: 'Lead Designer' },
      { name: 'Felipe Torres', role: 'UI' },
      { name: 'Larissa Prado', role: 'Dev Front' },
    ],
  },
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Refinar briefing com cliente',
    description:
      'Reunir feedback da reunião de kick-off e ajustar briefing no Notion.',
    projectId: 'project-1',
    owner: 'Mariana Lopes',
    dueDate: '2025-01-16',
    status: 'in_progress',
    priority: 'high',
    tags: ['Reunião', 'Planejamento'],
    checklist: [
      { label: 'Atualizar documento em Notion', completed: true },
      { label: 'Validar com cliente', completed: false },
    ],
  },
  {
    id: 'task-2',
    title: 'Protótipo mobile',
    description:
      'Criar protótipos navegáveis no Figma para telas principais do app.',
    projectId: 'project-2',
    owner: 'Paula Martins',
    dueDate: '2025-01-18',
    status: 'review',
    priority: 'medium',
    tags: ['Figma', 'UX'],
    checklist: [
      { label: 'Fluxo onboarding', completed: true },
      { label: 'Tela de desafios', completed: false },
      { label: 'Tela de recompensas', completed: false },
    ],
  },
  {
    id: 'task-3',
    title: 'Configurar ambiente Firebase',
    description:
      'Criar projeto, configurar Authentication e Firestore para o app.',
    projectId: 'project-2',
    owner: 'João Henrique',
    dueDate: '2025-01-19',
    status: 'todo',
    priority: 'high',
    tags: ['Firebase', 'Setup'],
    checklist: [
      { label: 'Criar projeto', completed: true },
      { label: 'Configurar auth', completed: false },
      { label: 'Criar coleções iniciais', completed: false },
    ],
  },
  {
    id: 'task-4',
    title: 'Landing page de lançamento',
    description:
      'Desenvolver landing page responsiva com seção de depoimentos e CTA dinâmico.',
    projectId: 'project-3',
    owner: 'Diego Rocha',
    dueDate: '2025-01-14',
    status: 'in_progress',
    priority: 'high',
    tags: ['Next.js', 'Design'],
    checklist: [
      { label: 'Criar layout Desktop', completed: true },
      { label: 'Versão Mobile', completed: false },
    ],
  },
  {
    id: 'task-5',
    title: 'Fluxo de automação RD Station',
    description:
      'Configurar automação de nurture pós-download com segmentação condicional.',
    projectId: 'project-3',
    owner: 'Renata Alves',
    dueDate: '2025-01-13',
    status: 'done',
    priority: 'medium',
    tags: ['Automação', 'RD Station'],
    checklist: [
      { label: 'Criar emails', completed: true },
      { label: 'Configurar segmentação', completed: true },
    ],
  },
  {
    id: 'task-6',
    title: 'Reunião de retrospectiva',
    description:
      'Revisar entregas do design system, coletar aprendizados com a equipe.',
    projectId: 'project-4',
    owner: 'Camila Rocha',
    dueDate: '2025-01-10',
    status: 'done',
    priority: 'low',
    tags: ['Retrospectiva'],
    checklist: [
      { label: 'Preparar pauta', completed: true },
      { label: 'Documentar insights', completed: true },
    ],
  },
  {
    id: 'task-7',
    title: 'Setup de analytics',
    description:
      'Integrar GA4 e eventos personalizados para o portal corporativo.',
    projectId: 'project-1',
    owner: 'Lucas Nascimento',
    dueDate: '2025-01-22',
    status: 'todo',
    priority: 'medium',
    tags: ['Analytics'],
    checklist: [
      { label: 'Mapear eventos', completed: false },
      { label: 'Configurar GTM', completed: false },
    ],
  },
];
