import { describe, expect, it } from 'vitest';
import { composeOfficial, officialScore, remainingMs } from '../score';
import { SUBJECTS } from '../content';
import { SAMPLE_QUESTIONS } from '../bank';
import type { AreaId, Question } from '../types';

const areaOf = (sid: string) => SUBJECTS.find((s) => s.id === sid)?.area;

describe('pontuação oficial da objetiva (pesos 1, 1 e 1,75)', () => {
  it('zero acertos = 0 pontos', () => {
    expect(officialScore({ basicos: 0, gerais: 0, especificos: 0 })).toBe(0);
  });
  it('todos os acertos = 100 pontos', () => {
    expect(officialScore({ basicos: 15, gerais: 15, especificos: 40 })).toBe(100);
  });
  it('12 em Básicos, 12 em Gerais e 34 em Específicos = 83,5 pontos', () => {
    expect(officialScore({ basicos: 12, gerais: 12, especificos: 34 })).toBe(83.5);
  });
});

describe('composição do simulado', () => {
  const q = (id: string, sid: string): Question => ({
    id, subjectId: sid, topicId: SUBJECTS.find((s) => s.id === sid)!.topics[0].id,
    statement: 'Enunciado de teste suficientemente longo', options: ['a', 'b', 'c', 'd'], answer: 0,
    explanation: 'x', origin: 'exemplo',
  });
  const fullPool = [
    ...Array.from({ length: 15 }, (_, i) => q(`b${i}`, 'lp')),
    ...Array.from({ length: 15 }, (_, i) => q(`g${i}`, 'mt')),
    ...Array.from({ length: 40 }, (_, i) => q(`e${i}`, 'esp')),
  ];
  it('com banco completo monta exatamente 15 + 15 + 40 = 70 questões', () => {
    const c = composeOfficial(fullPool, areaOf);
    expect(c.complete).toBe(true);
    expect(c.questions).toHaveLength(70);
    const count = (a: AreaId) => c.questions.filter((x) => areaOf(x.subjectId) === a).length;
    expect([count('basicos'), count('gerais'), count('especificos')]).toEqual([15, 15, 40]);
  });
  it('com banco insuficiente informa a falta por área e não marca como completo', () => {
    const c = composeOfficial(fullPool.filter((x) => x.subjectId !== 'esp'), areaOf);
    expect(c.complete).toBe(false);
    expect(c.shortfall.especificos).toBe(40);
    expect(c.shortfall.basicos).toBe(0);
  });
});

describe('cronômetro do simulado', () => {
  it('calcula o tempo restante a partir do timestamp inicial', () => {
    expect(remainingMs(0, 30, 10 * 60000)).toBe(20 * 60000);
  });
  it('chega a zero no limite e nunca fica negativo', () => {
    expect(remainingMs(0, 30, 45 * 60000)).toBe(0);
  });
  it('sem limite configurado não há tempo restante', () => {
    expect(remainingMs(0, null, 1000)).toBeNull();
  });
});

describe('validação do banco de questões', () => {
  it('todas as questões de exemplo passam na validação', async () => {
    const { validateBank } = await import('../validate');
    const { errors } = validateBank(SAMPLE_QUESTIONS);
    expect(errors).toEqual([]);
  });
  it('as 60 questões enviadas pelo usuário passam na validação e têm ids únicos', async () => {
    const { validateBank } = await import('../validate');
    const { SELECON_INEDITAS } = await import('../bank-selecon');
    const { valid, errors } = validateBank(SELECON_INEDITAS);
    expect(errors).toEqual([]);
    expect(valid).toHaveLength(60);
    expect(new Set(SELECON_INEDITAS.map((q) => q.id)).size).toBe(60);
  });
  it('nenhum id de exemplo se repete nas questões enviadas', async () => {
    const { SELECON_INEDITAS } = await import('../bank-selecon');
    const ids = new Set(SAMPLE_QUESTIONS.map((q) => q.id));
    expect(SELECON_INEDITAS.some((q) => ids.has(q.id))).toBe(false);
  });
  it('rejeita alternativas duplicadas', async () => {
    const { validateQuestion } = await import('../validate');
    const errs = validateQuestion({ ...SAMPLE_QUESTIONS[0], options: ['a', 'a', 'b', 'c'] });
    expect(errs.join(' ')).toMatch(/duplicadas/);
  });
  it('rejeita gabarito fora do intervalo', async () => {
    const { validateQuestion } = await import('../validate');
    const errs = validateQuestion({ ...SAMPLE_QUESTIONS[0], answer: 4 });
    expect(errs.join(' ')).toMatch(/gabarito/);
  });
  it('rejeita assunto que não pertence à disciplina', async () => {
    const { validateQuestion } = await import('../validate');
    const errs = validateQuestion({ ...SAMPLE_QUESTIONS[0], subjectId: 'lp', topicId: 'rlm-conj' });
    expect(errs.join(' ')).toMatch(/não pertence/);
  });
  it('rejeita id duplicado no mesmo lote', async () => {
    const { validateBank } = await import('../validate');
    const { valid, errors } = validateBank([SAMPLE_QUESTIONS[0], SAMPLE_QUESTIONS[0]]);
    expect(valid).toHaveLength(1);
    expect(errors.join(' ')).toMatch(/duplicado/);
  });
});
