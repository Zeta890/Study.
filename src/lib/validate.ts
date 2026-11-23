import { SUBJECTS } from './content';
import type { Question } from './types';

// Regras de validação de questões: impedem registros incompletos ou com gabarito inválido.
// Retorna a lista de problemas; lista vazia significa questão válida.
export function validateQuestion(raw: unknown): string[] {
  const errors: string[] = [];
  if (!raw || typeof raw !== 'object') return ['registro não é um objeto'];
  const q = raw as Partial<Question>;
  const id = typeof q.id === 'string' ? q.id : '(sem id)';

  if (typeof q.id !== 'string' || !q.id.trim()) errors.push('id ausente');
  const subject = SUBJECTS.find((s) => s.id === q.subjectId);
  if (!subject) errors.push(`disciplina "${String(q.subjectId)}" não existe`);
  if (subject && !subject.topics.some((t) => t.id === q.topicId)) {
    errors.push(`assunto "${String(q.topicId)}" não pertence à disciplina`);
  }
  if (typeof q.statement !== 'string' || q.statement.trim().length < 10) errors.push('enunciado ausente ou muito curto');
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    errors.push('são necessárias exatamente 4 alternativas');
  } else {
    if (q.options.some((o) => typeof o !== 'string' || !o.trim())) errors.push('há alternativa vazia');
    const norm = q.options.map((o) => String(o).trim().toLowerCase().replace(/\s+/g, ' '));
    if (new Set(norm).size !== norm.length) errors.push('há alternativas duplicadas');
  }
  if (!Number.isInteger(q.answer) || (q.answer as number) < 0 || (q.answer as number) > 3) {
    errors.push('gabarito deve ser um índice de 0 a 3');
  }
  if (typeof q.explanation !== 'string' || !q.explanation.trim()) errors.push('explicação ausente');
  if (q.origin !== 'exemplo' && q.origin !== 'importada') errors.push('origem deve ser "exemplo" ou "importada"');
  if (q.difficulty && !['facil', 'medio', 'dificil'].includes(q.difficulty)) errors.push('dificuldade inválida');

  return errors.map((e) => `${id}: ${e}`);
}

export function validateBank(list: unknown[]): { valid: Question[]; errors: string[] } {
  const errors: string[] = [];
  const valid: Question[] = [];
  const seen = new Set<string>();
  list.forEach((raw) => {
    const problems = validateQuestion(raw);
    const id = (raw as Partial<Question>)?.id;
    if (typeof id === 'string' && seen.has(id)) problems.push(`${id}: id duplicado`);
    if (problems.length) errors.push(...problems);
    else {
      valid.push(raw as Question);
      if (typeof id === 'string') seen.add(id);
    }
  });
  return { valid, errors };
}
