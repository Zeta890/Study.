import { EXAM } from './content';

export const TZ = EXAM.tz;

// Data de hoje no fuso de Cuiabá, em YYYY-MM-DD.
export function todayISO(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

// Cuiabá não usa horário de verão desde 2019: offset fixo -04:00.
export function examInstant(): Date {
  return new Date(`${EXAM.date}T${EXAM.startTime}:00-04:00`);
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  passed: boolean;
  isExamDay: boolean;
}

export function countdown(now: Date = new Date()): Countdown {
  const diff = examInstant().getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, passed: true, isExamDay: todayISO(now) === EXAM.date };
  }
  const totalMin = Math.floor(diff / 60000);
  return {
    days: Math.floor(totalMin / 1440),
    hours: Math.floor((totalMin % 1440) / 60),
    minutes: totalMin % 60,
    passed: false,
    isExamDay: todayISO(now) === EXAM.date,
  };
}

// Lista de datas de uma faixa, inclusive.
export function dateRange(start: string, end: string): string[] {
  const out: string[] = [];
  let cur = new Date(`${start}T12:00:00Z`);
  const last = new Date(`${end}T12:00:00Z`);
  while (cur <= last) {
    out.push(cur.toISOString().slice(0, 10));
    cur = new Date(cur.getTime() + 86400000);
  }
  return out;
}

export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  const ms = new Date(`${b}T12:00:00Z`).getTime() - new Date(`${a}T12:00:00Z`).getTime();
  return Math.round(ms / 86400000);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function weekdayShort(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'][d.getUTCDay()];
}

export function greeting(now: Date = new Date()): string {
  const h = Number(
    new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', hour12: false }).format(now),
  );
  if (h < 5) return 'Boa noite';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}
