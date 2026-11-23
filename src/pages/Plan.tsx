import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useStore } from '../lib/store';
import { EXAM } from '../lib/content';
import { dateRange, formatDate, todayISO, weekdayShort } from '../lib/dates';
import { activityKindLabel, availabilityFor, stageOf } from '../lib/plan';
import { activityTitle } from '../lib/activity';
import { Button, Card, Pill } from '../components/ui';
import { PageHeader } from '../components/Layout';
import type { Activity } from '../lib/types';

const STAGES = [
  { id: 'fundamentacao', label: 'Fundamentação', range: '23/11 a 29/11', text: 'Estudo dos fundamentos, diagnóstico e identificação dos erros.' },
  { id: 'cobertura', label: 'Cobertura do edital', range: '30/11 a 06/12', text: 'Ampliar a cobertura dos conteúdos com questões progressivas.' },
  { id: 'consolidacao', label: 'Consolidação', range: '07/12 a 13/12', text: 'Recuperar conhecimentos e resolver questões difíceis.' },
  { id: 'reta-final', label: 'Reta final', range: '14/12 a 19/12', text: 'Revisão dos conteúdos de maior peso, simulados e redação. No dia 19, revisão leve.' },
] as const;

export default function Plan() {
  const { me, dispatch } = useStore();
  const [onlyPending, setOnlyPending] = useState(false);
  const today = todayISO();

  const days = useMemo(() => dateRange(EXAM.prepStart, EXAM.prepEnd), []);
  if (!me) return null;

  const byDate = new Map<string, Activity[]>();
  for (const a of me.plan) byDate.set(a.date, [...(byDate.get(a.date) ?? []), a]);
  const replanned = me.plan.filter((a) => a.reason && a.status === 'pending').length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Cronograma"
        description="Cada dia tem três horas líquidas por padrão. Quando uma tarefa fica para trás, o app a redistribui e explica o motivo."
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setOnlyPending((v) => !v)} aria-pressed={onlyPending}>
              {onlyPending ? 'Mostrar tudo' : 'Só pendentes'}
            </Button>
            <Button variant="primary" onClick={() => dispatch({ type: 'replan' })}>
              <RefreshCw size={15} aria-hidden /> Replanejar
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {STAGES.map((s) => {
          const active = stageOf(today) === s.id;
          return (
            <Card key={s.id} className={active ? 'border-purple/50 bg-purple/[0.07]' : ''}>
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{s.label}</p>
                {active && <Pill tone="purple">Agora</Pill>}
              </div>
              <p className="num mt-1 text-xs text-muted">{s.range}</p>
              <p className="mt-2 text-sm text-muted">{s.text}</p>
            </Card>
          );
        })}
      </div>

      {replanned > 0 && (
        <p className="rounded-xl border border-blue/30 bg-blue/10 px-4 py-3 text-sm">
          {replanned} {replanned === 1 ? 'tarefa foi replanejada' : 'tarefas foram replanejadas'}. Os motivos aparecem em cada bloco.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {days.map((d) => {
          const acts = byDate.get(d) ?? [];
          const visible = onlyPending ? acts.filter((a) => a.status === 'pending') : acts;
          if (onlyPending && visible.length === 0) return null;
          const total = acts.reduce((s, a) => s + a.minutes, 0);
          const done = acts.filter((a) => a.status === 'done').reduce((s, a) => s + a.minutes, 0);
          const isToday = d === today;
          const isPast = d < today;
          const avail = availabilityFor(me, d);
          return (
            <Card key={d} as="section" className={`p-4 md:p-5 ${isToday ? 'border-purple/50' : ''} ${isPast ? 'opacity-80' : ''}`}>
              <div className="grid gap-4 md:grid-cols-[150px_1fr]">
                <div>
                  <p className="text-sm text-muted">{weekdayShort(d)}</p>
                  <p className="num text-lg font-semibold">{formatDate(d)}</p>
                  <p className="num mt-1 text-xs text-muted">
                    {avail === 0 ? 'Sem estudo' : `${avail} min disponíveis`}
                  </p>
                  {isToday && <Pill tone="purple">Hoje</Pill>}
                  {total > 0 && (
                    <p className="num mt-2 text-xs text-muted">{done} de {total} min concluídos</p>
                  )}
                </div>
                <ul className="flex flex-col gap-2">
                  {visible.length === 0 && <li className="text-sm text-muted">Nada planejado.</li>}
                  {visible.map((a) => (
                    <li key={a.id} className="flex flex-col gap-1 rounded-xl bg-surface-2/70 px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className={`text-sm font-medium ${a.status === 'done' ? 'text-muted line-through' : ''}`}>
                          {activityTitle(a)} <span className="font-normal text-muted">· {activityKindLabel(a.kind)}</span>{' '}
                          {a.status === 'unscheduled' && <Pill tone="amber">Não acomodada</Pill>}
                        </p>
                        {a.reason && <p className="mt-0.5 text-xs text-blue">{a.reason}</p>}
                      </div>
                      <div className="num shrink-0 text-xs text-muted">
                        {a.minutes} min {a.status === 'done' && <span className="text-mint">· feito</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
