import { AREAS } from './content';
import type { AreaId, Question } from './types';

// Distribuição oficial da parte objetiva: 15 + 15 + 40 = 70 questões, 100 pontos.
export const OFFICIAL_COMPOSITION: Record<AreaId, number> = { basicos: 15, gerais: 15, especificos: 40 };

// Pontuação objetiva: acertos × peso da área. Não há arredondamento intermediário.
// Zero acertos = 0; todos = 100; 12 em Básicos, 12 em Gerais e 34 em Específicos = 83,5.
export function officialScore(correct: Record<AreaId, number>): number {
  const total = (Object.keys(AREAS) as AreaId[]).reduce((sum, area) => sum + correct[area] * AREAS[area].pointsEach, 0);
  return Math.round(total * 100) / 100;
}

export interface Composition {
  complete: boolean; // true quando a distribuição 15/15/40 é atendida
  questions: Question[];
  shortfall: Record<AreaId, number>; // questões que faltam em cada área
}

// Monta o simulado a partir do banco validado. Se faltar questão em alguma área,
// complete = false e a interface deve oferecer um simulado parcial.
export function composeOfficial(
  pool: Question[],
  subjectArea: (id: string) => AreaId | undefined,
  rand: () => number = Math.random,
): Composition {
  const questions: Question[] = [];
  const shortfall = { basicos: 0, gerais: 0, especificos: 0 } as Record<AreaId, number>;
  for (const area of Object.keys(OFFICIAL_COMPOSITION) as AreaId[]) {
    const candidates = pool.filter((q) => subjectArea(q.subjectId) === area);
    const need = OFFICIAL_COMPOSITION[area];
    const picked = shuffle([...candidates], rand).slice(0, need);
    shortfall[area] = need - picked.length;
    questions.push(...picked);
  }
  return { complete: Object.values(shortfall).every((n) => n === 0), questions, shortfall };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Tempo restante do simulado com base em timestamps, para não depender de intervalos acumulados.
export function remainingMs(startedAt: number, limitMin: number | null, now: number): number | null {
  if (limitMin === null) return null;
  return Math.max(0, startedAt + limitMin * 60000 - now);
}
