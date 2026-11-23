import { describe, expect, it } from 'vitest';
import { availabilityFor, buildPlan, replan } from '../plan';
import { dateRange } from '../dates';
import { person } from './fixtures';
import type { Activity, PersonData } from '../types';

const PERIOD = dateRange('2026-11-23', '2026-12-19');
const minutesOn = (plan: Activity[], d: string) =>
  plan.filter((a) => a.date === d && a.status !== 'unscheduled').reduce((s, a) => s + a.minutes, 0);

describe('cronograma padrão', () => {
  it('cada dia planeja exatamente a disponibilidade de 180 min, exceto 19/12 (revisão leve)', () => {
    const p = person();
    const plan = buildPlan(p);
    for (const d of PERIOD.slice(0, -1)) expect(minutesOn(plan, d)).toBe(180);
    expect(minutesOn(plan, '2026-12-19')).toBeLessThan(180);
  });
  it('com 120 min, cada dia soma 120', () => {
    const p = person({ availability: { defaultMinutes: 120, overrides: {} } });
    const plan = buildPlan(p);
    for (const d of PERIOD.slice(0, -1)) expect(minutesOn(plan, d)).toBe(120);
  });
  it('dia com zero minutos não recebe atividades', () => {
    const p = person({ availability: { defaultMinutes: 180, overrides: { '2026-11-25': 0 } } });
    expect(buildPlan(p).some((a) => a.date === '2026-11-25')).toBe(false);
    expect(availabilityFor(p, '2026-11-25')).toBe(0);
  });
});

describe('replanejamento', () => {
  // Pedro não fez 23/11 e 24/11; hoje é 25/11.
  const base = (): PersonData => {
    const p = person();
    return { ...p, plan: buildPlan(p) };
  };

  it('nenhum dia futuro passa da disponibilidade após replanejar', () => {
    const r = replan(base(), '2026-11-25');
    for (const d of PERIOD.filter((x) => x >= '2026-11-25')) {
      expect(minutesOn(r.plan, d)).toBeLessThanOrEqual(availabilityFor(r, d));
    }
  });

  it('preserva o total de minutos pendentes (acomodados + não acomodados)', () => {
    const p = base();
    const overdue = p.plan.filter((a) => a.status === 'pending' && a.date < '2026-11-25').reduce((s, a) => s + a.minutes, 0);
    const r = replan(p, '2026-11-25');
    const moved = r.plan.filter((a) => a.reason?.startsWith('Replanejado')).reduce((s, a) => s + a.minutes, 0);
    const unsch = r.plan.filter((a) => a.status === 'unscheduled').reduce((s, a) => s + a.minutes, 0);
    expect(moved + unsch).toBe(overdue);
  });

  it('atividades concluídas não são alteradas', () => {
    const p = base();
    const first = p.plan.find((a) => a.date === '2026-11-23')!;
    const withDone = { ...p, plan: p.plan.map((a) => (a.id === first.id ? { ...a, status: 'done' as const } : a)) };
    const r = replan(withDone, '2026-11-25');
    expect(r.plan.find((a) => a.id === first.id)?.status).toBe('done');
  });

  it('sem capacidade nos dias restantes, marca como não acomodada com motivo', () => {
    const p = base();
    // Zera a disponibilidade de todos os dias futuros: não há onde encaixar.
    const overrides: Record<string, number> = {};
    for (const d of PERIOD.filter((x) => x >= '2026-11-25')) overrides[d] = 0;
    const r = replan({ ...p, availability: { ...p.availability, overrides } }, '2026-11-25');
    const unsch = r.plan.filter((a) => a.status === 'unscheduled');
    expect(unsch.length).toBeGreaterThan(0);
    expect(unsch.every((a) => a.reason?.startsWith('Não acomodada'))).toBe(true);
  });

  it('é idempotente: replanejar de novo não muda o cronograma', () => {
    const once = replan(base(), '2026-11-25');
    const twice = replan(once, '2026-11-25');
    expect(twice.plan).toEqual(once.plan);
  });
});
