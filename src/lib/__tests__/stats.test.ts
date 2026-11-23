import { describe, expect, it } from 'vitest';
import { masteredSubjects, needsReview, accuracy } from '../stats';
import { person } from './fixtures';
import type { AnswerRecord } from '../types';

const ans = (subjectId: string, correct: boolean, i = 0): AnswerRecord => ({
  questionId: `${subjectId}-${i}`, subjectId, topicId: `${subjectId}-t`, correct, mode: 'treino', date: '2026-11-23',
});

describe('domínio de assuntos', () => {
  it('não classifica como dominado com menos de 5 respostas, mesmo com 100% de acerto', () => {
    const p = person({ answers: [ans('lp', true, 1), ans('lp', true, 2), ans('lp', true, 3), ans('lp', true, 4)] });
    expect(masteredSubjects(p)).toEqual([]);
  });
  it('classifica como dominado com 5 ou mais respostas e pelo menos 70% de acerto', () => {
    const answers = [ans('lp', true, 1), ans('lp', true, 2), ans('lp', true, 3), ans('lp', true, 4), ans('lp', false, 5)];
    expect(masteredSubjects(person({ answers }))).toEqual(['lp']);
  });
  it('assunto nunca avaliado não aparece como dominado nem como revisão', () => {
    const p = person();
    expect(masteredSubjects(p)).toEqual([]);
    expect(needsReview(p)).toEqual([]);
  });
  it('acerto sem amostra retorna 0% e total 0, sem divisão por zero', () => {
    expect(accuracy([])).toEqual({ correct: 0, total: 0, pct: 0 });
  });
});
