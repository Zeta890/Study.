import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useStore } from '../lib/store';
import { EXAM } from '../lib/content';
import { formatDate, todayISO } from '../lib/dates';
import { Bar, Button, Card, Empty, Field, Pill, SectionTitle, inputClass } from '../components/ui';
import { PageHeader } from '../components/Layout';
import { coupleConsistency } from '../lib/activity';
import { executionRate, accuracy } from '../lib/stats';
import { cn } from '../components/cn';
import type { ProfileId, SharedGoal } from '../lib/types';

export default function Couple() {
  const { me, state, dispatch } = useStore();
  const [title, setTitle] = useState('');
  const [metric, setMetric] = useState<SharedGoal['metric']>('questoes');
  const [target, setTarget] = useState(200);
  const [deadline, setDeadline] = useState(EXAM.prepEnd);
  if (!me) return null;

  const today = todayISO();
  const partnerId: ProfileId = me.id === 'pedro' ? 'elizabeth' : 'pedro';
  const partner = state.people[partnerId];
  const consistency = coupleConsistency(me, partner, today);

  const countFor = (g: SharedGoal, id: ProfileId) => {
    const p = state.people[id];
    return g.metric === 'questoes' ? p.answers.length : p.studyLog.reduce((s, l) => s + l.minutes, 0);
  };

  const create = () => {
    if (!title.trim() || target <= 0) return;
    dispatch({
      type: 'add-goal',
      goal: { id: `goal-${Date.now()}`, title: title.trim(), metric, target, deadline, createdBy: me.id },
    });
    setTitle('');
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Casal"
        description="Metas e desafios em conjunto. Cada pessoa vê o próprio histórico e o do outro somente se o outro autorizar."
      />

      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
        {[me, partner].map((p) => {
          const isMe = p.id === me.id;
          const exec = executionRate(p, today);
          const acc = accuracy(p.answers);
          return (
            <Card key={p.id} as="section" className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">{p.displayName}{isMe ? ' (você)' : ''}</p>
                {!isMe && !p.shareProgress && <Pill tone="neutral">Privado</Pill>}
              </div>
              {(isMe || p.shareProgress) ? (
                <>
                  <Bar pct={exec.pct} label="Execução do plano" />
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <Mini label="Questões" value={String(p.answers.length)} />
                    <Mini label="Acerto" value={p.answers.length ? `${acc.pct}%` : '—'} />
                    <Mini label="Simulados" value={String(p.simulados.length)} />
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted">{p.displayName} não autorizou a visualização do progresso.</p>
              )}
            </Card>
          );
        })}
      </div>

      <Card as="section" className="flex flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-medium">Compartilhar meu progresso com {partner.displayName}</p>
            <p className="text-sm text-muted">Quando desligado, o parceiro vê apenas que o seu progresso é privado.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={me.shareProgress}
              onChange={() => dispatch({ type: 'toggle-share' })}
            />
            <span className="relative h-6 w-11 rounded-full bg-surface-2 transition-colors peer-checked:bg-purple peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-lilac after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" aria-hidden />
            <span>{me.shareProgress ? 'Compartilhado' : 'Privado'}</span>
          </label>
        </div>
        <Bar pct={consistency.pct} color="var(--color-mint)" label="Consistência do casal (dias em que os dois estudaram)" />
      </Card>

      <Card as="section" className="flex flex-col gap-5 p-6">
        <SectionTitle title="Metas conjuntas" hint="O progresso de cada um vem só dos seus próprios registros" />
        {state.shared.goals.length === 0 && (
          <Empty title="Nenhuma meta ainda" text="Crie uma meta, por exemplo 200 questões até 06/12, e acompanhem juntos." />
        )}
        <ul className="flex flex-col gap-4">
          {state.shared.goals.map((g) => {
            const mine = countFor(g, me.id);
            const theirs = partner.shareProgress ? countFor(g, partnerId) : null;
            const sum = mine + (theirs ?? 0);
            const unit = g.metric === 'questoes' ? 'questões' : 'min';
            return (
              <li key={g.id} className="rounded-2xl border border-line bg-surface-2/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{g.title}</p>
                    <p className="num text-xs text-muted">Meta de {g.target} {unit} até {formatDate(g.deadline)}</p>
                  </div>
                  <button onClick={() => dispatch({ type: 'delete-goal', id: g.id })} className="rounded-lg p-2 text-muted hover:bg-surface hover:text-[#ff8a8a]" aria-label={`Excluir meta ${g.title}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-3">
                  <Bar pct={(sum / g.target) * 100} color="var(--color-blue)" label="Progresso conjunto" />
                </div>
                <p className={cn('num mt-2 text-xs text-muted')}>
                  {me.displayName}: {mine} {unit}
                  {theirs !== null ? ` · ${partner.displayName}: ${theirs} ${unit}` : ` · ${partner.displayName}: privado`}
                </p>
              </li>
            );
          })}
        </ul>

        <div className="grid gap-4 border-t border-line pt-5 md:grid-cols-[1fr_140px_140px_160px_auto] md:items-end">
          <Field label="Nome da meta">
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: 200 questões até 06/12" />
          </Field>
          <Field label="Medida">
            <select className={inputClass} value={metric} onChange={(e) => setMetric(e.target.value as SharedGoal['metric'])}>
              <option value="questoes">Questões</option>
              <option value="minutos">Minutos</option>
            </select>
          </Field>
          <Field label="Alvo">
            <input type="number" min={1} className={inputClass} value={target} onChange={(e) => setTarget(Number(e.target.value))} />
          </Field>
          <Field label="Prazo">
            <input type="date" className={inputClass} value={deadline} min={EXAM.prepStart} max={EXAM.prepEnd} onChange={(e) => setDeadline(e.target.value)} />
          </Field>
          <Button variant="primary" disabled={!title.trim() || target <= 0} onClick={create}>Criar meta</Button>
        </div>
      </Card>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="num mt-1 font-semibold">{value}</p>
    </div>
  );
}
