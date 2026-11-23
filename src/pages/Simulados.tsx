import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../lib/store';
import { CHECKLIST_ESSAY, subjectById } from '../lib/content';
import { estimatedScore, bySubject, ratio } from '../lib/stats';
import { formatDate, todayISO } from '../lib/dates';
import { Bar, Button, Card, Empty, Field, Pill, inputClass } from '../components/ui';
import { PageHeader } from '../components/Layout';
import { cn } from '../components/cn';
import type { AnswerRecord, Question, SimuladoResult } from '../lib/types';

export default function Simulados() {
  const [params, setParams] = useSearchParams();
  const aba = params.get('aba') === 'redacao' ? 'redacao' : 'simulado';
  const setAba = (v: 'simulado' | 'redacao') => {
    const next = new URLSearchParams(params);
    next.set('aba', v);
    setParams(next, { replace: true });
  };
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Simulados e redação"
        description="Simulados cronometrados com o resultado salvo no seu histórico, e redações com a lista de critérios da banca."
      />
      <div role="tablist" className="flex w-fit gap-1 rounded-2xl border border-line bg-surface p-1">
        {(['simulado', 'redacao'] as const).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={aba === v}
            onClick={() => setAba(v)}
            className={cn('rounded-xl px-4 py-2 text-sm font-medium', aba === v ? 'bg-purple text-white' : 'text-muted hover:text-text')}
          >
            {v === 'simulado' ? 'Simulado' : 'Redação'}
          </button>
        ))}
      </div>
      {aba === 'simulado' ? <Mock /> : <Essay />}
    </div>
  );
}

interface Run {
  questions: Question[];
  picks: (number | null)[];
  startedAt: number;
  idx: number;
}

function Mock() {
  const { me, allQuestions, dispatch } = useStore();
  const [size, setSize] = useState(10);
  const [run, setRun] = useState<Run | null>(null);
  const [result, setResult] = useState<SimuladoResult | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [run]);

  if (!me) return null;

  const start = () => {
    const pool = [...allQuestions];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const qs = pool.slice(0, Math.min(size, pool.length));
    setResult(null);
    setNow(Date.now());
    setRun({ questions: qs, picks: qs.map(() => null), startedAt: Date.now(), idx: 0 });
  };

  const finish = () => {
    if (!run) return;
    const date = todayISO();
    const records: AnswerRecord[] = run.questions.map((q, i) => ({
      questionId: q.id,
      subjectId: q.subjectId,
      topicId: q.topicId,
      correct: run.picks[i] === q.answer,
      mode: 'simulado',
      date,
    }));
    records.forEach((r) => dispatch({ type: 'answer', questionId: r.questionId, correct: r.correct, record: r }));
    const minutes = Math.max(1, Math.round((Date.now() - run.startedAt) / 60000));
    const per = bySubject(records);
    const bySub: SimuladoResult['bySubject'] = {};
    for (const [sid, r] of Object.entries(per)) bySub[sid] = { total: r.total, correct: r.correct };
    const score = estimatedScore(records).score;
    const sim: SimuladoResult = {
      id: `sim-${Date.now()}`,
      date,
      label: `Simulado de ${run.questions.length} questões`,
      total: run.questions.length,
      correct: records.filter((r) => r.correct).length,
      minutes,
      bySubject: bySub,
      estimatedScore: score,
    };
    dispatch({ type: 'save-simulado', result: sim });
    setResult(sim);
    setRun(null);
  };

  if (result) {
    return (
      <Card className="flex flex-col gap-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Resultado do simulado</h2>
            <p className="text-sm text-muted">{formatDate(result.date)} · {result.minutes} min</p>
          </div>
          <Button variant="primary" onClick={() => setResult(null)}>Novo simulado</Button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Acertos" value={`${result.correct} de ${result.total}`} />
          <Stat label="Aproveitamento" value={`${ratio(result.correct, result.total).pct}%`} />
          <Stat label="Nota estimada" value={`${result.estimatedScore}/100`} hint="estimativa, não é nota oficial" />
          <Stat label="Tempo" value={`${result.minutes} min`} />
        </div>
        <div className="flex flex-col gap-3">
          {Object.entries(result.bySubject).map(([sid, r]) => (
            <Bar key={sid} pct={ratio(r.correct, r.total).pct} label={`${subjectById(sid)?.name}: ${r.correct} de ${r.total}`} />
          ))}
        </div>
        <p className="text-xs text-muted">Questões sem resposta contam como erro.</p>
      </Card>
    );
  }

  if (!run) {
    return (
      <Card className="flex flex-col gap-5 p-6">
        <div>
          <h2 className="text-lg font-semibold">Novo simulado</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            O simulado sorteia questões do banco, cronometra o tempo e salva o resultado no histórico.
            Na prova real a parte objetiva tem 70 questões e 4h30 de duração, incluída a discursiva.
          </p>
        </div>
        <Field label="Tamanho do bloco">
          <select className={cn(inputClass, 'max-w-xs')} value={size} onChange={(e) => setSize(Number(e.target.value))}>
            {[10, 20, 30, 70].map((n) => <option key={n} value={n}>{n} questões</option>)}
          </select>
        </Field>
        <div className="text-sm text-muted">Banco disponível: {allQuestions.length} questões.</div>
        <div><Button variant="primary" disabled={allQuestions.length === 0} onClick={start}>Começar</Button></div>
      </Card>
    );
  }

  const q = run.questions[run.idx];
  const elapsed = Math.floor((now - run.startedAt) / 1000);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  const answeredCount = run.picks.filter((p) => p !== null).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">Questão {run.idx + 1} de {run.questions.length} · {answeredCount} respondidas</p>
        <p className="num rounded-xl border border-line px-3 py-1.5 text-sm font-medium" aria-live="off">{mm}:{ss}</p>
      </div>
      <Bar pct={((run.idx + 1) / run.questions.length) * 100} />
      <Card as="article" className="flex flex-col gap-5 p-6">
        <Pill tone="purple">{subjectById(q.subjectId)?.name}</Pill>
        <p className="leading-relaxed">{q.statement}</p>
        <div role="radiogroup" aria-label="Alternativas" className="flex flex-col gap-2">
          {q.options.map((opt, i) => {
            const picked = run.picks[run.idx] === i;
            return (
              <button
                key={i}
                role="radio"
                aria-checked={picked}
                onClick={() => setRun({ ...run, picks: run.picks.map((p, k) => (k === run.idx ? i : p)) })}
                className={cn(
                  'flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors',
                  picked ? 'border-purple bg-purple/10' : 'border-line hover:bg-surface-2',
                )}
              >
                <span className="num grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-surface-2 text-xs font-semibold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <Button variant="ghost" disabled={run.idx === 0} onClick={() => setRun({ ...run, idx: run.idx - 1 })}>Anterior</Button>
          <div className="flex gap-2">
            <Button variant="danger" onClick={finish}>Finalizar simulado</Button>
            <Button variant="primary" disabled={run.idx >= run.questions.length - 1} onClick={() => setRun({ ...run, idx: run.idx + 1 })}>Próxima</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Essay() {
  const { me, dispatch } = useStore();
  const [theme, setTheme] = useState('');
  const [text, setText] = useState('');
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  if (!me) return null;

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estLines = Math.round(words / 10);
  const inRange = estLines >= 20 && estLines <= 30;

  const save = () => {
    dispatch({
      type: 'save-essay',
      essay: { id: `ess-${Date.now()}`, date: todayISO(), theme: theme.trim() || 'Tema livre', text, checklist: checks },
    });
    setText('');
    setTheme('');
    setChecks({});
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Card className="flex flex-col gap-4">
        <Field label="Tema" hint="Anote o tema que você recebeu no treino.">
          <input className={inputClass} value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Ex.: o papel do Legislativo municipal" />
        </Field>
        <Field label="Texto">
          <textarea className={cn(inputClass, 'min-h-72 leading-relaxed')} value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva ou cole o texto. Na prova, a redação é manuscrita, em caneta azul ou preta." />
        </Field>
        <div className="num flex flex-wrap items-center gap-3 text-sm">
          <Pill tone={inRange ? 'mint' : 'amber'}>≈ {estLines} linhas</Pill>
          <span className="text-muted">{words} palavras · estimativa de 10 palavras por linha. A meta é de 20 a 30 linhas.</span>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" disabled={!text.trim()} onClick={save}>Salvar redação</Button>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-3">
          <p className="font-medium">Lista de revisão</p>
          <p className="text-xs text-muted">Critérios do edital: conteúdo vale 80 pontos e forma vale 20.</p>
          {CHECKLIST_ESSAY.map((item) => (
            <label key={item} className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[#845eff]"
                checked={!!checks[item]}
                onChange={(e) => setChecks((c) => ({ ...c, [item]: e.target.checked }))}
              />
              <span>{item}</span>
            </label>
          ))}
          <p className="text-xs text-muted">{Object.values(checks).filter(Boolean).length} de {CHECKLIST_ESSAY.length} itens marcados</p>
        </Card>
        <Card className="flex flex-col gap-3">
          <p className="font-medium">Redações salvas</p>
          {me.essays.length === 0 && <Empty title="Nenhuma redação ainda" text="Salve a primeira para acompanhar a evolução." />}
          <ul className="flex flex-col gap-2 text-sm">
            {me.essays.slice(0, 8).map((e) => (
              <li key={e.id} className="rounded-xl bg-surface-2 px-3 py-2">
                <p className="font-medium">{e.theme}</p>
                <p className="num text-xs text-muted">{formatDate(e.date)} · {e.text.trim().split(/\s+/).filter(Boolean).length} palavras</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="num mt-1 text-lg font-semibold">{value}</p>
      {hint && <p className="text-[11px] text-muted">{hint}</p>}
    </div>
  );
}
