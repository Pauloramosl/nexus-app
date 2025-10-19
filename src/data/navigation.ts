import type { ComponentType } from 'react';
import {
  Squares2X2Icon,
  BriefcaseIcon,
  ArrowsRightLeftIcon,
  UsersIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  MegaphoneIcon,
  ClipboardDocumentCheckIcon,
  FolderOpenIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChatBubbleLeftRightIcon,
  NewspaperIcon,
  CloudArrowUpIcon,
  PresentationChartLineIcon,
  EnvelopeIcon,
  ChartBarSquareIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/react/24/outline';

export type NavIcon = ComponentType<{ className?: string }>;

export type NavItem = {
  label: string;
  to?: string;
  icon: NavIcon;
  badge?: string;
  children?: NavItem[];
};

export const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: Squares2X2Icon,
    to: '/',
  },
  {
    label: 'CRM',
    icon: BriefcaseIcon,
    children: [
      {
        label: 'Deals',
        to: '/crm/deals',
        icon: ArrowsRightLeftIcon,
      },
      {
        label: 'Clientes',
        to: '/crm/clients',
        icon: UsersIcon,
      },
      {
        label: 'Contratos',
        to: '/crm/contracts',
        icon: DocumentTextIcon,
      },
      {
        label: 'Agendamentos',
        to: '/crm/scheduling',
        icon: CalendarDaysIcon,
      },
      {
        label: 'Marketing',
        to: '/crm/marketing',
        icon: MegaphoneIcon,
      },
    ],
  },
  {
    label: 'Tarefas',
    icon: CheckCircleIcon,
    children: [
      {
        label: 'Minhas Tarefas',
        to: '/tasks/my',
        icon: ClipboardDocumentCheckIcon,
      },
      {
        label: 'Projetos',
        to: '/tasks/projects',
        icon: FolderOpenIcon,
      },
      {
        label: 'Calendário',
        to: '/tasks/calendar',
        icon: CalendarIcon,
      },
    ],
  },
  {
    label: 'Colaboração',
    icon: ChatBubbleOvalLeftEllipsisIcon,
    children: [
      {
        label: 'Mensagens',
        to: '/collaboration/messages',
        icon: ChatBubbleLeftRightIcon,
      },
      {
        label: 'Feed',
        to: '/collaboration/feed',
        icon: NewspaperIcon,
      },
      {
        label: 'Drive',
        to: '/collaboration/drive',
        icon: CloudArrowUpIcon,
      },
      {
        label: 'Whiteboards',
        to: '/collaboration/whiteboards',
        icon: PresentationChartLineIcon,
      },
      {
        label: 'Email',
        to: '/collaboration/email',
        icon: EnvelopeIcon,
      },
    ],
  },
  {
    label: 'Relatórios',
    icon: ChartBarSquareIcon,
    to: '/reports',
    badge: 'Breve',
  },
  {
    label: 'WhatsApp',
    icon: ChatBubbleBottomCenterTextIcon,
    to: '/whatsapp',
  },
];
