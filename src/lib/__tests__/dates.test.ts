import { describe, expect, it } from 'vitest';
import { countdown, dateRange, daysBetween, todayISO } from '../dates';

describe('datas no fuso America/Cuiaba (UTC-4, sem horário de verão)', () => {
  it('23/11 às 13:31 locais é 23/11', () => {
    expect(todayISO(new Date('2026-11-23T17:31:00Z'))).toBe('2026-11-23');
  });
  it('23/11 às 23:30 locais ainda é 23/11, mesmo já sendo 24/11 em UTC', () => {
    expect(todayISO(new Date('2026-11-24T03:30:00Z'))).toBe('2026-11-23');
  });
  it('virada de mês: 30/11 para 01/12', () => {
    expect(todayISO(new Date('2026-12-01T02:00:00Z'))).toBe('2026-11-30');
    expect(todayISO(new Date('2026-12-01T04:30:00Z'))).toBe('2026-12-01');
  });
  it('período de preparo tem 27 dias, de 23/11 a 19/12', () => {
    const days = dateRange('2026-11-23', '2026-12-19');
    expect(days).toHaveLength(27);
    expect(days[0]).toBe('2026-11-23');
    expect(days[26]).toBe('2026-12-19');
  });
  it('diferença entre 23/11 e 20/12 são 27 dias corridos', () => {
    expect(daysBetween('2026-11-23', '2026-12-20')).toBe(27);
  });
});

describe('contador regressivo', () => {
  it('23/11 às 13:31 locais: 26 dias, 23 horas e 29 minutos até 20/12 às 13:00', () => {
    const c = countdown(new Date('2026-11-23T17:31:00Z'));
    expect(c).toMatchObject({ days: 26, hours: 23, minutes: 29, passed: false, isExamDay: false });
  });
  it('19/12 às 20:00 locais: faltam menos de um dia', () => {
    const c = countdown(new Date('2026-12-20T00:00:00Z')); // 19/12 às 20:00 em Cuiabá
    expect(c.days).toBe(0);
    expect(c.hours).toBe(17);
    expect(c.passed).toBe(false);
  });
  it('20/12 antes das 13:00 locais: ainda é dia de prova e não passou', () => {
    const c = countdown(new Date('2026-12-20T14:00:00Z')); // 20/12 às 10:00 locais
    expect(c.isExamDay).toBe(true);
    expect(c.passed).toBe(false);
  });
  it('20/12 depois das 13:00 locais: prova já começou, contagem para', () => {
    const c = countdown(new Date('2026-12-20T18:00:00Z')); // 20/12 às 14:00 locais
    expect(c.passed).toBe(true);
    expect(c.isExamDay).toBe(true);
  });
  it('21/12: passou e não é dia de prova', () => {
    const c = countdown(new Date('2026-12-21T15:00:00Z'));
    expect(c.passed).toBe(true);
    expect(c.isExamDay).toBe(false);
  });
});
