import {
  Suspense,
  lazy,
  type LazyExoticComponent,
  type ReactElement,
} from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/components/protected-route';
import { AppLayout } from '@/layouts/app-layout';
import { ComingSoon } from '@/components/ui/coming-soon';
import { Spinner } from '@/components/ui/spinner';

const LoginPage = lazy(() =>
  import('@/features/auth/pages/login-page').then((module) => ({
    default: module.LoginPage,
  })),
);

const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/dashboard-page').then((module) => ({
    default: module.DashboardPage,
  })),
);

const DealsPage = lazy(() =>
  import('@/features/crm/pages/deals-page').then((module) => ({
    default: module.DealsPage,
  })),
);

const ClientsPage = lazy(() =>
  import('@/features/crm/pages/clients-page').then((module) => ({
    default: module.ClientsPage,
  })),
);

const MyTasksPage = lazy(() =>
  import('@/features/tasks/pages/my-tasks-page').then((module) => ({
    default: module.MyTasksPage,
  })),
);

const ProjectsPage = lazy(() =>
  import('@/features/tasks/pages/projects-page').then((module) => ({
    default: module.ProjectsPage,
  })),
);

const CalendarPage = lazy(() =>
  import('@/features/tasks/pages/calendar-page').then((module) => ({
    default: module.CalendarPage,
  })),
);

type LazyComponent = LazyExoticComponent<() => ReactElement>;

function withSuspense(Component: LazyComponent) {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Component />
    </Suspense>
  );
}

function RouteLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner />
    </div>
  );
}

const routes: RouteObject[] = [
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: withSuspense(DashboardPage),
      },
      {
        path: 'crm/deals',
        element: withSuspense(DealsPage),
      },
      {
        path: 'crm/clients',
        element: withSuspense(ClientsPage),
      },
      {
        path: 'crm/contracts',
        element: (
          <ComingSoon
            title="Gestão de Contratos"
            description="Envie, armazene e acompanhe contratos vinculados a negócios e clientes em um fluxo padronizado."
          />
        ),
      },
      {
        path: 'crm/scheduling',
        element: (
          <ComingSoon
            title="Agenda de Reuniões"
            description="Visualize compromissos, sincronize com o Google Calendar e nunca mais perca um follow-up importante."
          />
        ),
      },
      {
        path: 'crm/marketing',
        element: (
          <ComingSoon
            title="Planejamento de Marketing"
            description="Planeje campanhas, acompanhe leads e distribua ações de marketing integradas ao CRM."
          />
        ),
      },
      {
        path: 'tasks/my',
        element: withSuspense(MyTasksPage),
      },
      {
        path: 'tasks/projects',
        element: withSuspense(ProjectsPage),
      },
      {
        path: 'tasks/calendar',
        element: withSuspense(CalendarPage),
      },
      {
        path: 'collaboration/messages',
        element: (
          <ComingSoon
            title="Mensagens Internas"
            description="Converse com o time em canais e conversas diretas, mantendo o histórico vinculado aos projetos."
          />
        ),
      },
      {
        path: 'collaboration/feed',
        element: (
          <ComingSoon
            title="Feed de Atualizações"
            description="Reúna comunicados importantes, conquistas e novidades da agência em um único lugar."
          />
        ),
      },
      {
        path: 'collaboration/drive',
        element: (
          <ComingSoon
            title="Drive Integrado"
            description="Centralize arquivos por projeto, controle permissões e conecte com o Google Drive ou Firebase Storage."
          />
        ),
      },
      {
        path: 'collaboration/whiteboards',
        element: (
          <ComingSoon
            title="Quadros Colaborativos"
            description="Idealize fluxos, brainstorms e mapas mentais em quadros compartilhados com todo o time."
          />
        ),
      },
      {
        path: 'collaboration/email',
        element: (
          <ComingSoon
            title="Inbox de E-mails"
            description="Conecte a caixa da agência, envie e responda mensagens mantendo o histórico nos contatos do CRM."
          />
        ),
      },
      {
        path: 'reports',
        element: (
          <ComingSoon
            title="Relatórios e Insights"
            description="Gere relatórios de performance, produtividade e vendas para orientar decisões estratégicas."
          />
        ),
      },
      {
        path: 'whatsapp',
        element: (
          <ComingSoon
            title="Inbox WhatsApp Business"
            description="Integre a conta WhatsApp Business oficial e responda clientes com contexto do CRM."
          />
        ),
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
