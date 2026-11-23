import { AREAS, subjectById } from './content';
import { todayISO } from './dates';
import { plannedMinutesUntil } from './plan';
import type { AnswerRecord, AreaId, PersonData, Question } from './types';

export interface Ratio {
  correct: number;
  total: number;
  pct: number; // 0..100
}

export function ratio(correct: number, total: number): Ratio {
  return { correct, total, pct: total === 0 ? 0 : Math.round((correct / total) * 100) };
}

export function accuracy(answers: AnswerRecord[]): Ratio {
  return ratio(answers.filter((a) => a.correct).length, answers.length);
}

export function bySubject(answers: AnswerRecord[]): Record<string, Ratio> {
  const out: Record<string, Ratio> = {};
  for (const id of new Set(answers.map((a) => a.subjectId))) {
    out[id] = accuracy(answers.filter((a) => a.subjectId === id));
  }
  return out;
}

export function byArea(answers: AnswerRecord[]): Record<AreaId, Ratio> {
  const areas: AreaId[] = ['basicos', 'gerais', 'especificos'];
  const out = {} as Record<AreaId, Ratio>;
  for (const area of areas) {
    const subset = answers.filter((a) => subjectById(a.subjectId)?.area === area);
    out[area] = accuracy(subset);
  }
  return out;
}

// Pontuação ponderada estimada: aproveitamento de cada área × pontos da área.
// É uma estimativa para acompanhar a evolução. Não é nota oficial.
export function estimatedScore(answers: AnswerRecord[]): { score: number; maxScore: number; coverage: number } {
  const areas = byArea(answers);
  let score = 0;
  let answeredAreas = 0;
  for (const area of Object.keys(AREAS) as AreaId[]) {
    if (areas[area].total > 0) {
      answeredAreas++;
      score += (areas[area].pct / 100) * AREAS[area].points;
    }
  }
  const maxScore = 100;
  return { score: Math.round(score * 10) / 10, maxScore, coverage: Math.round((answeredAreas / 3) * 100) };
}

export function studiedMinutes(person: PersonData, until: string = todayISO()): number {
  return person.studyLog.filter((l) => l.date <= until).reduce((s, l) => s + l.minutes, 0);
}

export function executionRate(person: PersonData, today: string = todayISO()): { done: number; planned: number; pct: number } {
  const planned = plannedMinutesUntil(person, today);
  const done = studiedMinutes(person, today);
  return { done, planned, pct: planned === 0 ? 0 : Math.min(100, Math.round((done / planned) * 100)) };
}

export function topicsDone(person: PersonData): number {
  return Object.values(person.topicStatus).filter((s) => s === 'done').length;
}

// Assuntos dominados: concluídos e com aproveitamento alto em amostra suficiente.
export function masteredSubjects(person: PersonData): string[] {
  const subj = bySubject(person.answers);
  return Object.entries(subj)
    .filter(([, r]) => r.total >= 5 && r.pct >= 70)
    .map(([id]) => id);
}

// Assuntos que precisam de revisão: aproveitamento baixo ou cartões vencidos.
export function needsReview(person: PersonData, today: string = todayISO()): string[] {
  const subj = bySubject(person.answers);
  const due = Object.entries(person.reviews).filter(([, c]) => c.due <= today);
  const dueSubjects = new Set(
    due.map(([qid]) => person.answers.find((a) => a.questionId === qid)?.subjectId).filter(Boolean) as string[],
  );
  const low = Object.entries(subj)
    .filter(([, r]) => r.total >= 3 && r.pct < 60)
    .map(([id]) => id);
  return Array.from(new Set([...low, ...dueSubjects]));
}

export function dueReviews(person: PersonData, today: string = todayISO()): string[] {
  return Object.entries(person.reviews)
    .filter(([, c]) => c.due <= today)
    .map(([qid]) => qid);
}

// Escolhe a próxima questão: prioriza revisões vencidas, depois as de disciplinas fracas.
export function pickNext(
  pool: Question[],
  person: PersonData,
  options: { subjectId?: string; onlyDue?: boolean } = {},
): Question | undefined {
  const due = new Set(dueReviews(person));
  const answered = new Set(person.answers.map((a) => a.questionId));
  let candidates = pool.filter((q) => (!options.subjectId || q.subjectId === options.subjectId));
  if (options.onlyDue) candidates = candidates.filter((q) => due.has(q.id));
  const fresh = candidates.filter((q) => !answered.has(q.id));
  const dueFirst = candidates.filter((q) => due.has(q.id));
  return dueFirst[0] ?? fresh[0] ?? candidates[0];
}
