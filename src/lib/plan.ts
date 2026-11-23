import { AREAS, EXAM, SUBJECTS, subjectById } from './content';
import { dateRange, formatDate, todayISO } from './dates';
import type { Activity, ActivityKind, PersonData } from './types';

// Distribuição padrão (minutos líquidos para 180 min/dia), do prompt do projeto.
const BASE_SLOTS = [
  { key: 'esp', minutes: 60 },
  { key: 'basic', minutes: 45 },
  { key: 'other', minutes: 40 },
  { key: 'review', minutes: 35 },
] as const;

// Reserva de carga por dia para absorver tarefas replanejadas, sem empilhar tudo em um dia.
const RESERVA_MIN = 30;

const OTHER_SUBJECTS = ['info', 'leg', 'mt', 'etica', 'relint'];
const ESP_TOPICS = SUBJECTS.find((s) => s.id === 'esp')!.topics;

export function availabilityFor(person: PersonData, date: string): number {
  return person.availability.overrides[date] ?? person.availability.defaultMinutes;
}

export function stageOf(date: string): 'fundamentacao' | 'cobertura' | 'consolidacao' | 'reta-final' {
  if (date <= '2026-11-29') return 'fundamentacao';
  if (date <= '2026-12-06') return 'cobertura';
  if (date <= '2026-12-13') return 'consolidacao';
  return 'reta-final';
}

// Ajusta os blocos padrão para o total de minutos disponível do dia.
function scaleSlots(total: number): number[] {
  const base = BASE_SLOTS.reduce((a, s) => a + s.minutes, 0);
  const scaled = BASE_SLOTS.map((s) => Math.max(10, Math.round((s.minutes * total) / base / 5) * 5));
  const diff = total - scaled.reduce((a, b) => a + b, 0);
  scaled[0] += diff; // o ajuste de arredondamento fica no bloco de Específicos
  return scaled;
}

function buildDay(person: PersonData, date: string, dayIndex: number): Activity[] {
  const total = availabilityFor(person, date);
  if (total <= 0) return [];
  const stage = stageOf(date);
  const minutes = scaleSlots(total);
  const weakBasic = person.weakSubjects.find((id) => subjectById(id)?.area === 'basicos');
  const basicSubject = weakBasic ?? (dayIndex % 2 === 0 ? 'lp' : 'rlm');
  const basicTopics = subjectById(basicSubject)!.topics;
  const otherSubject = OTHER_SUBJECTS[dayIndex % OTHER_SUBJECTS.length];
  const otherTopics = subjectById(otherSubject)!.topics;

  const reviewKind: ActivityKind =
    stage === 'reta-final' ? 'simulado' : dayIndex % 3 === 0 ? 'revisao' : dayIndex % 3 === 1 ? 'questoes' : 'redacao';

  const lightDay = date === EXAM.prepEnd;

  const slots: Activity[] = [
    {
      id: `${date}-esp`, date, kind: 'estudo', subjectId: 'esp',
      topicId: ESP_TOPICS[dayIndex % ESP_TOPICS.length].id, minutes: minutes[0], status: 'pending',
    },
    {
      id: `${date}-basic`, date, kind: 'estudo', subjectId: basicSubject,
      topicId: basicTopics[dayIndex % basicTopics.length].id, minutes: minutes[1], status: 'pending',
      reason: weakBasic ? 'Reforçado: dificuldade inicial registrada no perfil' : undefined,
    },
    {
      id: `${date}-other`, date, kind: 'estudo', subjectId: otherSubject,
      topicId: otherTopics[dayIndex % otherTopics.length].id, minutes: minutes[2], status: 'pending',
    },
    {
      id: `${date}-review`, date, kind: reviewKind, subjectId: 'esp',
      minutes: minutes[3], status: 'pending',
    },
  ];

  if (lightDay) {
    return slots.map((a) => ({
      ...a,
      kind: a.kind === 'estudo' ? 'revisao' : a.kind,
      minutes: Math.max(10, Math.round((a.minutes / 2) / 5) * 5),
      reason: 'Véspera da prova: revisão mais leve',
    }));
  }
  return slots.filter((a) => a.minutes > 0);
}

// Gera o cronograma completo de 23/11 a 19/12 para uma pessoa.
export function buildPlan(person: PersonData): Activity[] {
  const days = dateRange(EXAM.prepStart, EXAM.prepEnd);
  return days.flatMap((d, i) => buildDay(person, d, i));
}

// Atividades de hoje, a missão do dia.
export function missionFor(person: PersonData, today: string = todayISO()): Activity[] {
  return person.plan.filter((a) => a.date === today);
}

export function plannedMinutesUntil(person: PersonData, date: string): number {
  return person.plan.filter((a) => a.date <= date).reduce((s, a) => s + a.minutes, 0);
}

// Horas líquidas que ainda restam entre hoje e o último dia de preparo.
export function remainingNetMinutes(person: PersonData, today: string = todayISO()): number {
  return dateRange(today > EXAM.prepStart ? today : EXAM.prepStart, EXAM.prepEnd)
    .reduce((s, d) => s + availabilityFor(person, d), 0);
}

// Replanejamento: tarefas pendentes de dias passados são divididas em partes e
// distribuídas para os dias futuros com menos carga. Nenhum dia recebe tudo de uma vez.
export function replan(person: PersonData, today: string = todayISO()): PersonData {
  const overdue = person.plan.filter((a) => a.status === 'pending' && a.date < today);
  if (overdue.length === 0) return person;

  const keep = person.plan.filter((a) => !(a.status === 'pending' && a.date < today));
  // O último dia é de revisão leve: só recebe carga se não houver outro.
  const futureDays = dateRange(today, EXAM.prepEnd);
  const pool = futureDays.filter((d) => d !== EXAM.prepEnd);
  const days = pool.length ? pool : futureDays;

  const load = new Map<string, number>();
  for (const a of keep) load.set(a.date, (load.get(a.date) ?? 0) + a.minutes);

  const moved: Activity[] = [];
  for (const a of overdue) {
    const area = subjectById(a.subjectId)?.area ?? 'basicos';
    const factors = [
      'menor carga entre os dias seguintes',
      `peso de ${AREAS[area].label.toLowerCase()} (${AREAS[area].points} pts)`,
      daysBetween(today, EXAM.date) <= 14 ? 'proximidade da prova' : 'necessidade de cobertura',
    ];
    if (person.weakSubjects.includes(a.subjectId)) factors.push('dificuldade individual');

    let remaining = a.minutes;
    let part = 0;
    while (remaining > 0) {
      const open = days.filter((d) => (load.get(d) ?? 0) < availabilityFor(person, d) + RESERVA_MIN);
      const candidates = open.length ? open : days;
      const day = candidates.reduce((best, d) => ((load.get(d) ?? 0) < (load.get(best) ?? 0) ? d : best), candidates[0]);
      const room = availabilityFor(person, day) + RESERVA_MIN - (load.get(day) ?? 0);
      const chunk = open.length ? Math.min(remaining, Math.max(5, Math.floor(room / 5) * 5)) : remaining;
      load.set(day, (load.get(day) ?? 0) + chunk);
      part += 1;
      moved.push({
        ...a,
        id: `${day}-moved-${a.id}-${part}`,
        date: day,
        minutes: chunk,
        reason: open.length
          ? `Replanejado de ${formatDate(a.date)}${remaining > chunk || part > 1 ? ' (em partes)' : ''}: ${factors.join('; ')}.`
          : `Replanejado de ${formatDate(a.date)}, mas sem tempo livre nos próximos dias: priorizar no bloco de revisão da reta final.`,
      });
      remaining -= chunk;
    }
  }
  return { ...person, plan: [...keep, ...moved].sort((x, y) => x.date.localeCompare(y.date)) };
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(`${b}T12:00:00Z`).getTime() - new Date(`${a}T12:00:00Z`).getTime()) / 86400000);
}

export function activityKindLabel(k: ActivityKind): string {
  return { estudo: 'Estudo', revisao: 'Revisão', questoes: 'Questões', redacao: 'Redação', simulado: 'Simulado' }[k];
}
