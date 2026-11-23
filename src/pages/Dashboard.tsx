import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowUpRight, Lock } from 'lucide-react';
import { useStore, type Action } from '../lib/store';
import { EXAM, subjectById, topicById } from '../lib/content';
import { countdown, greeting, todayISO, formatDate, daysBetween, dateRange } from '../lib/dates';
import { missionFor, remainingNetMinutes, activityKindLabel } from '../lib/plan';
import { accuracy, executionRate, estimatedScore, masteredSubjects, needsReview, dueReviews, studiedMinutes } from '../lib/stats';
import { activityGoal, activityHref, activityTitle, coupleConsistency } from '../lib/activity';
import { Bar, Button, Card, Empty, Pill, Ring, SectionTitle } from '../components/ui';
import type { Activity, PersonData, ProfileId } from '../lib/types';

const KIND_COLOR: Record<Activity['kind'], string> = {
  estudo: 'var(--color-purple)',
  revisao: 'var(--color-amber)',
  questoes: 'var(--color-blue)',
  redacao: 'var(--color-mint)',
  simulado: 'var(--color-lilac)',
};

function formatHours(min: number): string {
  return `${Math.round((min / 60) * 10) / 10} h`;
}

export default function Dashboard() {
  const { me, state, dispatch, allQuestions } = useStore();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const today = todayISO(now);
  const cd = countdown(now);
  if (!me) return null;

  const mission = missionFor(me, today);
  const missionTotal = mission.reduce((s, a) => s + a.minutes, 0);
  const missionDone = mission.length > 0 && mission.every((a) => a.status === 'done');
  const exec = executionRate(me, today);
  const acc = accuracy(me.answers);
  const score = estimatedScore(me.answers);
  const mastered = masteredSubjects(me);
  const review = needsReview(me, today);
  const dueCount = dueReviews(me, today).length;
  const remainingH = formatHours(remainingNetMinutes(me, today));
  const partnerId: ProfileId = me.id === 'pedro' ? 'elizabeth' : 'pedro';
  const partner = state.people[partnerId];
  const consistency = coupleConsistency(me, partner, today);
  const prepDays = dateRange(EXAM.prepStart, EXAM.prepEnd).length;
  const dayCount = Math.max(1, Math.min(prepDays, daysBetween(EXAM.prepStart, today) + 1));

  return (
    <div className="flex flex-col gap-6">
      <Hero
        name={me.displayName}
        greet={greeting(now)}
        days={cd.days}
        hours={cd.hours}
        minutes={cd.minutes}
        passed={cd.passed}
        isExamDay={cd.isExamDay}
        remainingH={remainingH}
        todayLabel={formatDate(today)}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 xl:col-span-2">
          <Card as="section" className="p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Sua missão de hoje</h2>
                <p className="mt-1 text-sm text-muted">
                  {mission.length === 0
                    ? 'Nenhuma atividade para hoje.'
                    : `${formatHours(missionTotal)} líquidas, em ${mission.length} blocos. ${mission.filter((a) => a.status === 'done').length} de ${mission.length} concluídos.`}
                </p>
              </div>
              {missionDone && <Pill tone="mint">Missão concluída</Pill>}
            </div>

            {mission.length > 0 ? (
              <>
                <TimeBar activities={mission} />
                <ul className="mt-5 flex flex-col gap-3">
                  {mission.map((a, i) => (
                    <MissionItem key={a.id} activity={a} index={i} onDispatch={dispatch} />
                  ))}
                </ul>
              </>
            ) : (
              <Empty
                title="Sem missão para hoje"
                text="Depois da prova ou fora do período de preparo, o plano não tem atividades. Confira o cronograma completo."
                action={<Link to="/plano"><Button variant="ghost">Ver o plano</Button></Link>}
              />
            )}
          </Card>

          <Card as="section" className="p-6">
            <SectionTitle
              title="Progresso de preparação"
              hint={`Dia ${dayCount} de ${prepDays} do período de preparo`}
              action={<Link to="/progresso" className="inline-flex items-center gap-1 text-sm text-lilac hover:underline">Detalhes <ArrowUpRight size={14} /></Link>}
            />
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <Ring pct={exec.pct} size={108} stroke={8} color="var(--color-purple)" />
                <div className="text-sm">
                  <p className="text-muted">Execução</p>
                  <p className="num text-lg font-semibold">{formatHours(exec.done)} <span className="text-sm font-normal text-muted">de {formatHours(exec.planned)}</span></p>
                  <p className="text-muted">horas realizadas e planejadas</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Questões" value={String(me.answers.length)} />
                <Stat label="Precisão" value={me.answers.length ? `${acc.pct}%` : '—'} />
                <Stat label="Nota estimada" value={me.answers.length ? `${score.score}/${score.maxScore}` : '—'} hint="estimativa" />
                <Stat label="Simulados" value={String(me.simulados.length)} />
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium">Assuntos dominados</p>
                {mastered.length ? (
                  <div className="flex flex-wrap gap-2">
                    {mastered.map((s) => <Pill key={s} tone="mint">{subjectById(s)?.name}</Pill>)}
                  </div>
                ) : (
                  <p className="text-sm text-muted">Ainda não há amostra suficiente. São necessárias 5 questões com 70% de acerto.</p>
                )}
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Precisam de revisão</p>
                {review.length || dueCount ? (
                  <div className="flex flex-wrap gap-2">
                    {review.map((s) => <Pill key={s} tone="amber">{subjectById(s)?.name}</Pill>)}
                    {dueCount > 0 && <Pill tone="amber">{dueCount} cartões vencidos</Pill>}
                  </div>
                ) : (
                  <p className="text-sm text-muted">Nada pendente. Continue resolvendo questões.</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <Card as="section" className="p-6">
            <SectionTitle title="Visão do casal" hint="Cada painel mostra só o que a pessoa autorizou" />
            <div className="flex flex-col gap-4">
              <CoupleCard person={me} label="Você" today={today} />
              <CoupleCard person={partner} label={partner.displayName} today={today} />
            </div>
            <div className="mt-5 border-t border-line pt-5">
              <Bar
                pct={consistency.pct}
                color="var(--color-mint)"
                label="Consistência do casal"
              />
              <JointGoal me={me} partner={partner} />
            </div>
          </Card>

          <Card as="section" className="p-6">
            <h2 className="mb-2 text-base font-semibold">Mensagem do dia</h2>
            <p className="text-sm leading-relaxed text-muted">
              {smartMessage({ me, today, missionDone, dueCount, remainingH, accuracyPct: acc.pct, total: me.answers.length, pool: allQuestions.length })}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Hero({
  name, greet, days, hours, minutes, passed, isExamDay, remainingH, todayLabel,
}: {
  name: string; greet: string; days: number; hours: number; minutes: number; passed: boolean; isExamDay: boolean; remainingH: string; todayLabel: string;
}) {
  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-line bg-surface p-6 md:flex-row md:items-center md:justify-between md:p-8">
      <div>
        <p className="text-sm text-muted">{todayLabel}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
          {greet}, {name}.
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          {passed
            ? isExamDay
              ? 'Hoje é dia de prova. Chegue cedo, confira o cartão de confirmação e respire.'
              : 'A data da prova já passou. Confira os resultados oficiais da Selecon.'
            : `Faltam ${days} dias para a sua prova. Hoje é mais uma oportunidade de avançar.`}
        </p>
        <p className="mt-3 text-sm text-muted">
          Horas líquidas restantes até 19/12: <span className="num font-medium text-text">{remainingH}</span>
        </p>
      </div>
      {!passed && (
        <div className="flex items-stretch divide-x divide-line overflow-hidden rounded-2xl border border-line bg-surface-2">
          <Count value={days} label="dias" />
          <Count value={hours} label="horas" />
          <Count value={minutes} label="min" />
        </div>
      )}
    </section>
  );
}

function Count({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-[88px] px-5 py-4 text-center">
      <p className="num text-3xl font-semibold tracking-tight md:text-4xl">{String(value).padStart(2, '0')}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

function TimeBar({ activities }: { activities: Activity[] }) {
  const total = activities.reduce((s, a) => s + a.minutes, 0) || 1;
  return (
    <div>
      <div className="flex h-3 w-full gap-1 overflow-hidden rounded-full" role="img" aria-label="Divisão do tempo de hoje entre os blocos da missão">
        {activities.map((a) => (
          <div
            key={a.id}
            className="h-full origin-left rounded-full transition-[flex-grow] duration-500"
            style={{ flexGrow: a.minutes / total, background: KIND_COLOR[a.kind], opacity: a.status === 'done' ? 0.45 : 1 }}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        {activities.map((a) => (
          <span key={a.id} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR[a.kind] }} aria-hidden />
            {activityKindLabel(a.kind)} {a.minutes} min
          </span>
        ))}
      </div>
    </div>
  );
}

function MissionItem({ activity: a, index, onDispatch }: { activity: Activity; index: number; onDispatch: (action: Action) => void }) {
  const goal = activityGoal(a);
  const done = a.status === 'done';
  const topic = a.topicId ? topicById(a.topicId)?.name : undefined;
  return (
    <li
      className="group flex flex-col gap-4 rounded-2xl border border-line bg-surface-2/60 p-4 transition-colors hover:border-purple/40 sm:flex-row sm:items-center"
      style={{ animation: `fadeIn .4s ease-out ${index * 70}ms both` }}
    >
      <div className="flex min-w-0 flex-1 gap-4">
        <button
          onClick={() =>
            onDispatch(
              done
                ? { type: 'undo-activity', activityId: a.id }
                : { type: 'complete-activity', activityId: a.id, minutes: a.minutes, subjectId: a.subjectId, date: a.date },
            )
          }
          className="mt-0.5 shrink-0 text-muted transition-colors hover:text-mint"
          aria-label={done ? `Desmarcar ${activityTitle(a)}` : `Marcar ${activityTitle(a)} como concluído`}
          aria-pressed={done}
        >
          {done ? <CheckCircle2 className="text-mint" size={22} /> : <Circle size={22} />}
        </button>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`font-medium ${done ? 'text-muted line-through decoration-muted/60' : ''}`}>{activityTitle(a)}</p>
            <Pill tone={a.kind === 'revisao' ? 'amber' : a.kind === 'redacao' ? 'mint' : 'purple'}>{activityKindLabel(a.kind)}</Pill>
            {a.reason?.startsWith('Replanejado') && <Pill tone="blue">Replanejado</Pill>}
          </div>
          {topic && <p className="mt-0.5 truncate text-sm text-text/90">{topic}</p>}
          <p className="mt-1 text-sm text-muted">{goal.objective}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted num">
            <span>{a.minutes} min</span>
            {goal.questions > 0 && <span>{goal.questions} questões</span>}
            {a.reason && <span className="max-w-full">{a.reason}</span>}
          </div>
        </div>
      </div>
      <Link
        to={activityHref(a)}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-line px-3.5 py-2 text-sm font-medium hover:bg-surface hover:text-lilac"
      >
        Iniciar estudo
      </Link>
    </li>
  );
}

function CoupleCard({ person, label, today }: { person: PersonData; label: string; today: string }) {
  const visible = person.shareProgress;
  if (!visible) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-line p-4">
        <Lock size={18} className="text-muted" aria-hidden />
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted">Progresso privado nesta conta.</p>
        </div>
      </div>
    );
  }
  const exec = executionRate(person, today);
  const acc = accuracy(person.answers);
  const mission = missionFor(person, today);
  const doneToday = mission.filter((a) => a.status === 'done').length;
  return (
    <div className="rounded-2xl border border-line bg-surface-2/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-medium">{label}</p>
        <Pill tone="neutral">{doneToday}/{mission.length} hoje</Pill>
      </div>
      <Bar pct={exec.pct} label="Execução do plano" />
      <div className="mt-3 flex justify-between text-xs text-muted num">
        <span>{formatHours(studiedMinutes(person, today))} estudadas</span>
        <span>{person.answers.length ? `${acc.pct}% de acerto` : 'sem questões'}</span>
      </div>
    </div>
  );
}

function JointGoal({ me, partner }: { me: PersonData; partner: PersonData }) {
  const { state } = useStore();
  const goal = state.shared.goals[0];
  if (!goal) {
    return (
      <p className="mt-4 text-sm text-muted">
        Ainda não há meta conjunta. Crie uma na aba Casal.
      </p>
    );
  }
  const count = (p: PersonData) =>
    goal.metric === 'questoes' ? p.answers.length : p.studyLog.reduce((s, l) => s + l.minutes, 0);
  const mine = count(me);
  const theirs = partner.shareProgress ? count(partner) : null;
  const sum = mine + (theirs ?? 0);
  return (
    <div className="mt-4">
      <Bar pct={(sum / goal.target) * 100} color="var(--color-blue)" label={`Meta conjunta: ${goal.title}`} />
      <p className="mt-2 text-xs text-muted num">
        {mine} {goal.metric === 'questoes' ? 'questões' : 'min'} de você
        {theirs !== null ? ` · ${theirs} do parceiro(a)` : ' · parceiro(a) com progresso privado'} · prazo {formatDate(goal.deadline)}
      </p>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="num mt-1 text-lg font-semibold">{value}</p>
      {hint && <p className="text-[11px] text-muted">{hint}</p>}
    </div>
  );
}

function smartMessage(args: {
  me: PersonData; today: string; missionDone: boolean; dueCount: number; remainingH: string; accuracyPct: number; total: number; pool: number;
}): string {
  const { me, missionDone, dueCount, remainingH, accuracyPct, total } = args;
  if (!me.diagnosticDone) {
    return 'Faça o diagnóstico antes de personalizar a trilha. Ele mostra por onde começar, sem presumir nada sobre o seu nível.';
  }
  if (missionDone) {
    return 'Missão do dia concluída. Registre as dúvidas para revisar amanhã e descanse bem.';
  }
  if (dueCount > 0) {
    return `Você tem ${dueCount} ${dueCount === 1 ? 'revisão vencida' : 'revisões vencidas'}. Comece por elas antes do conteúdo novo.`;
  }
  if (total >= 10 && accuracyPct >= 70) {
    return `Seu acerto está em ${accuracyPct}% nas questões feitas. Mantenha o ritmo e aumente a dificuldade do bloco.`;
  }
  if (total >= 10) {
    return `Seu acerto está em ${accuracyPct}%. Refaça os erros com a explicação antes de avançar no conteúdo.`;
  }
  return `Restam ${remainingH} líquidas até 19/12. Concentre-se no bloco de Específicos, que vale 70 dos 100 pontos.`;
}
