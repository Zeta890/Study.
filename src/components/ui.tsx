import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

export function Card({ className, children, as = 'div' }: { className?: string; children: ReactNode; as?: 'div' | 'section' | 'article' }) {
  const Tag = as;
  return (
    <Tag className={cn('rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_18px_40px_-24px_rgba(0,0,0,0.6)]', className)}>
      {children}
    </Tag>
  );
}

export function SectionTitle({ title, action, hint }: { title: string; action?: ReactNode; hint?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

type Variant = 'primary' | 'ghost' | 'subtle' | 'danger';

export function Button({
  variant = 'primary', className, ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const styles: Record<Variant, string> = {
    primary: 'bg-purple text-white shadow-[0_8px_24px_-10px_rgba(132,94,255,0.8)] hover:bg-[#9274ff]',
    ghost: 'border border-line text-text hover:bg-surface-2',
    subtle: 'text-muted hover:text-text hover:bg-surface-2',
    danger: 'text-[#ff8a8a] hover:bg-[#ff8a8a]/10',
  };
  return (
    <button
      {...rest}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45',
        styles[variant],
        className,
      )}
    />
  );
}

export function Bar({ pct, color = 'var(--color-purple)', label, className }: { pct: number; color?: string; label?: string; className?: string }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-1.5 flex justify-between text-xs text-muted">
          <span>{label}</span>
          <span className="num">{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${clamped}%`, background: color }} />
      </div>
    </div>
  );
}

export function Ring({ pct, size = 56, stroke = 5, color = 'var(--color-mint)', children }: { pct: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (clamped / 100) * c} className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-xs font-semibold num">{children ?? `${Math.round(clamped)}%`}</div>
    </div>
  );
}

export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'purple' | 'mint' | 'amber' | 'blue' }) {
  const tones = {
    neutral: 'bg-surface-2 text-muted',
    purple: 'bg-purple/15 text-lilac',
    mint: 'bg-mint/12 text-mint',
    amber: 'bg-amber/12 text-amber',
    blue: 'bg-blue/12 text-blue',
  };
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone])}>{children}</span>;
}

export function Empty({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-line px-6 py-10 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-purple/12 text-lilac" aria-hidden>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5h16v10H8l-4 4z" />
        </svg>
      </div>
      <p className="font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export const inputClass =
  'w-full rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-muted focus:border-lilac focus:outline-none';
