import { useEffect } from 'react';
import {
  useNavigate,
  useLocation,
  type Location,
} from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/providers/auth-provider';

export function LoginPage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [from, loading, navigate, user]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-3 text-primary-700 dark:text-primary-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 font-semibold text-white shadow-lg">
            NX
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Bem-vindo ao
            </p>
            <h1 className="text-2xl font-bold">NEXUS Platform</h1>
          </div>
        </div>

        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12">
        <div className="grid w-full max-w-4xl gap-10 rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur md:grid-cols-2 md:p-12 dark:bg-slate-900/90">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
              Plataforma tudo-em-um
            </p>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
              Conecte sua equipe e seus clientes em um só lugar.
            </h2>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              O NEXUS centraliza CRM, gestão de projetos, colaboração e
              comunicação para agências digitais. Faça login com sua conta
              Google para começar a construir fluxos mais rápidos e eficientes.
            </p>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                Autenticação segura com Google
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                Painel completo de CRM e projetos
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                Experiência responsiva e Modo Escuro
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-center gap-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900/60">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Entrar com Google
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Em poucos segundos você estará dentro do NEXUS para acompanhar
                clientes, negócios e tarefas.
              </p>
            </div>

            <Button
              onClick={loginWithGoogle}
              loading={loading}
              className="w-full justify-center"
              variant="primary"
              size="lg"
            >
              Continuar com Google
            </Button>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ao continuar, você aceita os Termos de Uso e a Política de
              Privacidade da plataforma NEXUS.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
