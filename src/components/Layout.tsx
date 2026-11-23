import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, BookOpen, CalendarDays, Heart, LayoutDashboard, LogOut, MoreHorizontal, Moon, Search, Settings, Sun, Target, X } from 'lucide-react';
import { useStore } from '../lib/store';
import { executionRate } from '../lib/stats';
import { todayISO } from '../lib/dates';
import { Ring } from './ui';
import { cn } from './cn';

const NAV = [
  { to: '/', label: 'Hoje', icon: LayoutDashboard, end: true },
  { to: '/plano', label: 'Plano', icon: CalendarDays },
  { to: '/estudo', label: 'Estudo', icon: BookOpen },
  { to: '/simulados', label: 'Simulados', icon: Target },
  { to: '/progresso', label: 'Progresso', icon: BarChart3 },
  { to: '/casal', label: 'Casal', icon: Heart },
  { to: '/ajustes', label: 'Ajustes', icon: Settings },
];

// No celular, as quatro primeiras seções ficam na barra; o resto abre em "Mais".
const MOBILE_MAIN = NAV.slice(0, 4);
const MOBILE_MORE = NAV.slice(4);

function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    localStorage.getItem('missao11:theme') === 'light' ? 'light' : 'dark',
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('missao11:theme', theme);
  }, [theme]);
  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) };
}

export default function Layout() {
  const { me, dispatch } = useStore();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);
  const overall = me ? executionRate(me, todayISO()) : { pct: 0 };

  useEffect(() => {
    document.title = `MISSÃO 11 — ${me?.displayName ?? ''}`;
    setMoreOpen(false);
  }, [me, location.pathname]);

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) navigate(`/estudo?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="ambient min-h-screen">
      <div className="flex min-h-screen">
        {/* Sidebar fixa no desktop */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface/70 p-4 lg:flex">
          <div className="mb-8 flex items-center gap-3 px-2">
            <Logo />
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-tight">MISSÃO 11</p>
              <p className="truncate text-xs text-muted">Nossa jornada até a aprovação</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1" aria-label="Principal">
            {NAV.map((n) => (
              <SideLink key={n.to} {...n} />
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-line bg-surface-2 p-4">
            <div className="flex items-center gap-3">
              <Ring pct={overall.pct} size={44} stroke={4} color="var(--color-purple)" />
              <div className="min-w-0">
                <p className="text-sm font-medium">Execução do plano</p>
                <p className="text-xs text-muted">Horas feitas sobre as planejadas</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="glass sticky top-0 z-20 flex items-center gap-3 border-b border-line px-4 py-3 md:px-6">
            <div className="flex items-center gap-2 lg:hidden">
              <Logo small />
              <span className="text-sm font-semibold">MISSÃO 11</span>
            </div>
            <form onSubmit={submitSearch} className="relative hidden max-w-md flex-1 md:block" role="search">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar assunto"
                aria-label="Buscar assunto"
                className="w-full rounded-xl border border-line bg-surface-2 py-2 pl-9 pr-3 text-sm placeholder:text-muted focus:border-lilac focus:outline-none"
              />
            </form>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={toggle}
                className="grid h-9 w-9 place-items-center rounded-xl border border-line text-muted hover:text-text"
                aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <div className="hidden items-center gap-2 rounded-xl border border-line py-1 pl-1 pr-3 sm:flex">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-purple/20 text-xs font-semibold text-lilac">
                  {me?.displayName.slice(0, 1)}
                </span>
                <span className="text-sm">{me?.displayName}</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'logout' })}
                className="grid h-9 w-9 place-items-center rounded-xl border border-line text-muted hover:text-text"
                aria-label="Trocar de perfil"
              >
                <LogOut size={16} />
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 pb-28 pt-6 md:px-8 lg:pb-12">
            <div key={location.pathname} className="mx-auto w-full min-w-0 max-w-6xl animate-[fadeIn_.35s_ease-out]">
              <Outlet />
            </div>
          </main>

          {/* Menu "Mais" no celular */}
          {moreOpen && (
            <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Mais seções">
              <button className="absolute inset-0 bg-black/50" onClick={() => setMoreOpen(false)} aria-label="Fechar menu" />
              <div className="glass absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-line p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold">Mais seções</p>
                  <button onClick={() => setMoreOpen(false)} className="rounded-lg p-2 text-muted hover:text-text" aria-label="Fechar">
                    <X size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {MOBILE_MORE.map((n) => (
                    <NavLink
                      key={n.to}
                      to={n.to}
                      className={({ isActive }) =>
                        cn('flex flex-col items-center gap-2 rounded-2xl border border-line py-4 text-xs font-medium', isActive ? 'bg-purple/15 text-lilac' : 'text-muted')
                      }
                    >
                      <n.icon size={20} aria-hidden />
                      {n.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navegação inferior no celular */}
          <nav className="glass fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Principal móvel">
            {MOBILE_MAIN.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn('flex min-h-14 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium', isActive ? 'text-lilac' : 'text-muted')
                }
              >
                <n.icon size={19} aria-hidden />
                {n.label}
              </NavLink>
            ))}
            <button
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              className={cn('flex min-h-14 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium', moreOpen || MOBILE_MORE.some((n) => location.pathname.startsWith(n.to)) ? 'text-lilac' : 'text-muted')}
            >
              <MoreHorizontal size={19} aria-hidden />
              Mais
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

function SideLink({ to, label, icon: Icon, end }: { to: string; label: string; icon: typeof Heart; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
          isActive ? 'bg-purple/15 text-text' : 'text-muted hover:bg-surface-2 hover:text-text',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-purple" aria-hidden />}
          <Icon size={18} className={isActive ? 'text-lilac' : ''} aria-hidden />
          {label}
        </>
      )}
    </NavLink>
  );
}

function Logo({ small }: { small?: boolean }) {
  const size = small ? 28 : 36;
  return (
    <span
      className="grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple to-blue shadow-[0_8px_24px_-8px_rgba(132,94,255,0.9)]"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18V6l8 7 8-7v12" />
      </svg>
    </span>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
