import { useStore } from '../lib/store';
import { availabilityFor } from '../lib/plan';
import { Card } from '../components/ui';
import { countdown, todayISO } from '../lib/dates';
import { useMemo } from 'react';

export default function Login() {
  const { state, dispatch } = useStore();
  const cd = useMemo(() => countdown(), []);

  return (
    <div className="ambient grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">MISSÃO 11</h1>
          <p className="mt-2 text-muted">Nossa Jornada até a Aprovação</p>
          <p className="mt-6 text-sm text-muted">
            Faltam <span className="num font-semibold text-text">{cd.days}</span> dias para a prova de Técnico Legislativo, em 20/12/2026.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(['pedro', 'elizabeth'] as const).map((id) => {
            const p = state.people[id];
            return (
              <Card key={id} className="flex flex-col gap-4 p-6">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-purple to-blue text-lg font-semibold text-white">
                    {p.displayName.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-lg font-semibold">{p.displayName}</p>
                    <p className="text-sm text-muted">{p.startNote}</p>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-surface-2 p-3">
                    <dt className="text-muted">Disponível hoje</dt>
                    <dd className="num font-semibold">{Math.round((availabilityFor(p, todayISO()) / 60) * 10) / 10} h líquidas</dd>
                  </div>
                  <div className="rounded-xl bg-surface-2 p-3">
                    <dt className="text-muted">Diagnóstico</dt>
                    <dd className="font-semibold">{p.diagnosticDone ? 'Concluído' : 'Pendente'}</dd>
                  </div>
                </dl>
                <button
                  onClick={() => dispatch({ type: 'login', id })}
                  className="mt-auto rounded-xl bg-purple py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_-10px_rgba(132,94,255,0.8)] hover:bg-[#9274ff]"
                >
                  Entrar como {p.displayName}
                </button>
              </Card>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          Os dados ficam guardados neste navegador. Cada perfil tem histórico, cronograma e redações próprios.
        </p>
      </div>
    </div>
  );
}
