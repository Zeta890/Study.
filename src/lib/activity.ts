import { subjectById, topicById } from './content';
import { dateRange } from './dates';
import type { Activity, PersonData } from './types';
import { EXAM } from './content';

// Metas de cada atividade, para a missão do dia.
export function activityGoal(a: Activity): { questions: number; objective: string } {
  const topic = a.topicId ? topicById(a.topicId)?.name : undefined;
  switch (a.kind) {
    case 'estudo':
      return {
        questions: 10,
        objective: `Estudar ${topic ?? 'o conteúdo'} e resolver 10 questões de fixação`,
      };
    case 'revisao':
      return { questions: 10, objective: 'Revisar cartões vencidos e refazer os erros recentes' };
    case 'questoes':
      return { questions: 20, objective: 'Resolver 20 questões em tempo cronometrado' };
    case 'redacao':
      return { questions: 0, objective: 'Escrever um texto dissertativo de 20 a 30 linhas e revisar com a lista' };
    case 'simulado':
      return { questions: 30, objective: 'Fazer um bloco de 30 questões sem consulta e registrar o resultado' };
  }
}

// Caminho que abre a atividade no lugar certo.
export function activityHref(a: Activity): string {
  if (a.kind === 'redacao') return '/simulados?aba=redacao';
  if (a.kind === 'simulado') return '/simulados?aba=simulado';
  if (a.kind === 'revisao') return '/estudo?aba=revisao';
  if (a.topicId) return `/estudo?subject=${a.subjectId}&topic=${a.topicId}`;
  return `/estudo?subject=${a.subjectId}`;
}

export function activityTitle(a: Activity): string {
  if (a.kind === 'redacao') return 'Redação';
  if (a.kind === 'simulado') return 'Simulado';
  if (a.kind === 'revisao') return 'Revisão espaçada';
  return subjectById(a.subjectId)?.name ?? 'Estudo';
}

// Dias em que a pessoa registrou estudo, dentro da preparação até hoje.
export function studyDays(p: PersonData, today: string): Set<string> {
  return new Set(p.studyLog.filter((l) => l.date <= today).map((l) => l.date));
}

// Consistência do casal: dias em que os dois estudaram, sobre os dias de preparo já decorridos.
export function coupleConsistency(a: PersonData, b: PersonData, today: string): { pct: number; days: number } {
  const elapsed = dateRange(EXAM.prepStart, today < EXAM.prepEnd ? today : EXAM.prepEnd);
  if (elapsed.length === 0) return { pct: 0, days: 0 };
  const da = studyDays(a, today);
  const db = studyDays(b, today);
  const both = elapsed.filter((d) => da.has(d) && db.has(d)).length;
  return { pct: Math.round((both / elapsed.length) * 100), days: both };
}
