import { describe, expect, it } from 'vitest';
import { masteredSubjects, needsReview, accuracy, pickNext } from '../stats';
import type { Question } from '../types';
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

const qs = (ids: string[]): Question[] => ids.map((id) => ({
  id, subjectId: 'lp', topicId: 'lp-morfo', statement: 'Enunciado de teste suficiente', options: ['a', 'b', 'c', 'd'], answer: 0, explanation: 'x', origin: 'exemplo',
}));

describe('escolha da próxima questão', () => {
  it('não devolve a mesma questão atual quando há outra disponível', () => {
    const pool = qs(['q1', 'q2']);
    const next = pickNext(pool, person(), { subjectId: 'lp', exclude: 'q1' });
    expect(next?.id).toBe('q2');
  });
  it('quando tudo já foi respondido, volta pela mais antiga e não repete a atual', () => {
    const pool = qs(['q1', 'q2', 'q3']);
    const answers = [ans('lp', true, 1), ans('lp', true, 2), ans('lp', true, 3)].map((a, i) => ({ ...a, questionId: ['q1', 'q2', 'q3'][i] }));
    const p = person({ answers });
    expect(pickNext(pool, p, { subjectId: 'lp', exclude: 'q3' })?.id).toBe('q1');
  });
  it('com uma única questão na disciplina, devolve ela mesma', () => {
    expect(pickNext(qs(['q1']), person(), { subjectId: 'lp', exclude: 'q1' })?.id).toBe('q1');
  });
  it('sem questões, devolve undefined', () => {
    expect(pickNext([], person(), { subjectId: 'lp' })).toBeUndefined();
  });
});
