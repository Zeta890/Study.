import { useState } from 'react';
import { askTutor, tutorConfigured, TUTOR_MODES, type TutorMode } from '../lib/tutor';
import { Button, Card, Field, inputClass } from './ui';
import { cn } from './cn';

export default function Tutor() {
  const [mode, setMode] = useState<TutorMode>('explicar');
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const current = TUTOR_MODES.find((m) => m.id === mode)!;

  async function send() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    const r = await askTutor(mode, input);
    setLoading(false);
    if (r.ok) setAnswer(r.text);
    else setError(r.error);
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div>
        <p className="font-medium">Tutor de IA</p>
        <p className="text-sm text-muted">
          Ajuda para estudar. As respostas são geradas por IA e podem conter erros: confira no material do edital antes de usar.
        </p>
      </div>
      {!tutorConfigured && (
        <p role="status" className="rounded-xl bg-amber/10 px-4 py-3 text-sm text-amber">
          Tutor não configurado neste ambiente. Peça ao responsável pelo deploy para definir as variáveis do Supabase.
        </p>
      )}
      <div role="radiogroup" aria-label="Modo do tutor" className="flex flex-wrap gap-2">
        {TUTOR_MODES.map((m) => (
          <button
            key={m.id}
            role="radio"
            aria-checked={mode === m.id}
            onClick={() => setMode(m.id)}
            className={cn('rounded-xl border px-3 py-1.5 text-sm', mode === m.id ? 'border-purple bg-purple/10' : 'border-line text-muted hover:text-text')}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted">{current.hint}</p>
      <Field label="Seu pedido" hint="Até 4000 caracteres. Não envie dados pessoais.">
        <textarea className={inputClass} rows={5} maxLength={4000} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ex.: explique a diferença entre crase e preposição." />
      </Field>
      <div>
        <Button variant="primary" disabled={!input.trim() || loading || !tutorConfigured} onClick={send}>
          {loading ? 'Consultando...' : 'Enviar'}
        </Button>
      </div>
      {error && <p role="alert" className="rounded-xl bg-[#ff8a8a]/10 px-4 py-3 text-sm text-[#ffb3b3]">{error}</p>}
      {answer && <div className="whitespace-pre-wrap rounded-xl bg-surface-2 p-4 text-sm leading-relaxed">{answer}</div>}
    </Card>
  );
}
