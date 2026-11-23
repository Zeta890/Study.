import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../lib/store';
import { AREAS, CHECKLIST_ESSAY, subjectById } from '../lib/content';
import { formatDate, todayISO } from '../lib/dates';
import { bySubject, ratio } from '../lib/stats';
import { composeOfficial, officialScore, remainingMs, OFFICIAL_COMPOSITION } from '../lib/score';
import { Bar, Button, Card, Empty, Field, Pill, inputClass } from '../components/ui';
import { PageHeader } from '../components/Layout';
import { cn } from '../components/cn';
import type { AnswerRecord, AreaId, Question, SimuladoResult } from '../lib/types';

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
        description="Simulados com a distribuição da prova objetiva, tentativa salva no navegador e redação com lista de critérios."
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

// Tentativa em andamento, guardada por perfil para sobreviver a fechamentos acidentais.
interface Attempt {
  questionIds: string[];
  picks: (number | null)[];
  idx: number;
  startedAt: number;
  limitMin: number | null;
  partial: boolean;
}

const attemptKey = (id: string) => `missao11:attempt:${id}`;

function readAttempt(id: string): Attempt | null {
  try {
    const raw = localStorage.getItem(attemptKey(id));
    return raw ? (JSON.parse(raw) as Attempt) : null;
  } catch {
    return null;
  }
}

function Mock() {
  const { me, allQuestions, dispatch } = useStore();
  const [limitInput, setLimitInput] = useState('');
  const [attempt, setAttempt] = useState<Attempt | null>(() => (me ? readAttempt(me.id) : null));
  const [result, setResult] = useState<SimuladoResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const questionsById = useMemo(() => new Map(allQuestions.map((q) => [q.id, q])), [allQuestions]);
  const areaFor = (sid: string) => subjectById(sid)?.area;

  useEffect(() => {
    if (!attempt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [attempt]);

  if (!me) return null;
  const pid = me.id;

  const save = (a: Attempt | null) => {
    setAttempt(a);
    if (a) localStorage.setItem(attemptKey(pid), JSON.stringify(a));
    else localStorage.removeItem(attemptKey(pid));
  };

  const start = (requireComplete: boolean) => {
    const comp = composeOfficial(allQuestions, areaFor);
    if (requireComplete && !comp.complete) {
      const falta = (Object.keys(comp.shortfall) as AreaId[])
        .filter((a) => comp.shortfall[a] > 0)
        .map((a) => `${AREAS[a].label} (faltam ${comp.shortfall[a]})`)
        .join('; ');
      setNotice(`O banco não tem questões válidas suficientes para a distribuição oficial: ${falta}. Use o simulado parcial.`);
      return;
    }
    if (comp.questions.length === 0) {
      setNotice('Não há questões válidas no banco para montar o simulado.');
      return;
    }
    const limit = limitInput.trim() ? Number(limitInput) : null;
    if (limit !== null && (!Number.isFinite(limit) || limit <= 0)) {
      setNotice('Informe um tempo limite em minutos, maior que zero, ou deixe em branco.');
      return;
    }
    setNotice(null);
    setResult(null);
    save({
      questionIds: comp.questions.map((q) => q.id),
      picks: comp.questions.map(() => null),
      idx: 0,
      startedAt: Date.now(),
      limitMin: limit,
      partial: !comp.complete,
    });
  };

  const finish = (auto = false) => {
    if (!attempt) return;
    const qs = attempt.questionIds.map((id) => questionsById.get(id)).filter(Boolean) as Question[];
    const date = todayISO();
    const records: AnswerRecord[] = qs.map((q, i) => ({
      questionId: q.id,
      subjectId: q.subjectId,
      topicId: q.topicId,
      correct: attempt.picks[i] === q.answer,
      mode: 'simulado',
      date,
    }));
    records.forEach((r) => dispatch({ type: 'answer', questionId: r.questionId, correct: r.correct, record: r }));

    const correctByArea = { basicos: 0, gerais: 0, especificos: 0 } as Record<AreaId, number>;
    records.forEach((r) => {
      const area = areaFor(r.subjectId);
      if (area && r.correct) correctByArea[area] += 1;
    });
    const per = bySubject(records);
    const bySub: SimuladoResult['bySubject'] = {};
    for (const [sid, r] of Object.entries(per)) bySub[sid] = { total: r.total, correct: r.correct };

    const sim: SimuladoResult = {
      id: `sim-${Date.now()}`,
      date,
      label: `${attempt.partial ? 'Simulado parcial' : 'Simulado'} de ${qs.length} questões${auto ? ' (tempo esgotado)' : ''}`,
      total: qs.length,
      correct: records.filter((r) => r.correct).length,
      minutes: Math.max(1, Math.round((Date.now() - attempt.startedAt) / 60000)),
      bySubject: bySub,
      estimatedScore: officialScore(correctByArea),
    };
    dispatch({ type: 'save-simulado', result: sim });
    setResult(sim);
    save(null);
  };

  // Encerramento automático quando o tempo configurado acaba.
  const remaining = attempt ? remainingMs(attempt.startedAt, attempt.limitMin, now) : null;
  useEffect(() => {
    if (attempt && remaining === 0) finish(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

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
          <Stat label="Pontuação objetiva" value={`${result.estimatedScore} de 100`} hint="pela regra de pesos do edital" />
          <Stat label="Tempo" value={`${result.minutes} min`} />
        </div>
        <div className="flex flex-col gap-3">
          {Object.entries(result.bySubject).map(([sid, r]) => (
            <Bar key={sid} pct={ratio(r.correct, r.total).pct} label={`${subjectById(sid)?.name}: ${r.correct} de ${r.total}`} />
          ))}
        </div>
        <p className="text-xs text-muted">
          Questões sem resposta contam como erro. A pontuação não inclui a prova discursiva e não é a nota oficial.
        </p>
      </Card>
    );
  }

  if (!attempt) {
    return (
      <Card className="flex flex-col gap-5 p-6">
        <div>
          <h2 className="text-lg font-semibold">Novo simulado</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            A prova objetiva tem 70 questões: 15 de Conhecimentos Básicos, 15 de Gerais e 40 de Específicos.
            Os pesos são 1, 1 e 1,75, somando 100 pontos. O tempo oficial é compartilhado com a discursiva e não está
            configurado aqui: informe um limite se quiser simular a pressão de tempo.
          </p>
          <p className="mt-2 text-sm text-muted">
            Banco atual: {allQuestions.length} questões, das quais {allQuestions.filter((q) => areaFor(q.subjectId)).length} são válidas para a distribuição.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-[200px_auto] md:items-end">
          <Field label="Tempo limite (minutos)" hint="Deixe vazio para não encerrar automaticamente.">
            <input type="number" min={1} className={inputClass} value={limitInput} onChange={(e) => setLimitInput(e.target.value)} placeholder="Sem limite" />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" disabled={allQuestions.length === 0} onClick={() => start(true)}>Simulado completo</Button>
            <Button variant="ghost" disabled={allQuestions.length === 0} onClick={() => start(false)}>Simulado parcial</Button>
          </div>
        </div>
        {notice && <p role="status" className="rounded-xl bg-amber/10 px-4 py-3 text-sm text-amber">{notice}</p>}
        <p className="text-xs text-muted">Distribuição oficial usada: {OFFICIAL_COMPOSITION.basicos} + {OFFICIAL_COMPOSITION.gerais} + {OFFICIAL_COMPOSITION.especificos}.</p>
      </Card>
    );
  }

  // Tentativa em andamento
  const qs = attempt.questionIds.map((id) => questionsById.get(id)).filter(Boolean) as Question[];
  const q = qs[attempt.idx];
  const answered = attempt.picks.filter((p) => p !== null).length;
  const elapsed = Math.floor((now - attempt.startedAt) / 1000);
  const clock = remaining !== null ? Math.ceil(remaining / 1000) : elapsed;
  const mm = String(Math.floor(clock / 60)).padStart(2, '0');
  const ss = String(clock % 60).padStart(2, '0');

  const setPick = (i: number) => save({ ...attempt, picks: attempt.picks.map((p, k) => (k === attempt.idx ? i : p)) });
  const goTo = (idx: number) => save({ ...attempt, idx });

  if (!q) {
    return (
      <Card className="flex flex-col gap-4 p-6">
        <p className="font-medium">Não foi possível carregar as questões desta tentativa.</p>
        <p className="text-sm text-muted">Pode ter havido alteração no banco. Abandone a tentativa e comece outra.</p>
        <div><Button variant="danger" onClick={() => save(null)}>Abandonar tentativa</Button></div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">Questão {attempt.idx + 1} de {qs.length} · {answered} respondidas{attempt.partial ? ' · parcial' : ''}</p>
          <p className={cn('num rounded-xl border px-3 py-1.5 text-sm font-medium', remaining !== null && remaining < 5 * 60000 ? 'border-amber text-amber' : 'border-line')} aria-live="off">
            {remaining !== null ? `Restam ${mm}:${ss}` : `${mm}:${ss}`}
          </p>
        </div>
        <Bar pct={((attempt.idx + 1) / qs.length) * 100} />
        <Card as="article" className="flex flex-col gap-5 p-6">
          <Pill tone="purple">{subjectById(q.subjectId)?.name}</Pill>
          <p className="leading-relaxed">{q.statement}</p>
          <div role="radiogroup" aria-label="Alternativas" className="flex flex-col gap-2">
            {q.options.map((opt, i) => {
              const picked = attempt.picks[attempt.idx] === i;
              return (
                <button
                  key={i}
                  role="radio"
                  aria-checked={picked}
                  onClick={() => setPick(i)}
                  className={cn('flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors', picked ? 'border-purple bg-purple/10' : 'border-line hover:bg-surface-2')}
                >
                  <span className="num grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-surface-2 text-xs font-semibold">{String.fromCharCode(65 + i)}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <Button variant="ghost" disabled={attempt.idx === 0} onClick={() => goTo(attempt.idx - 1)}>Anterior</Button>
            <Button variant="primary" disabled={attempt.idx >= qs.length - 1} onClick={() => goTo(attempt.idx + 1)}>Próxima</Button>
          </div>
        </Card>
      </div>

      <Card className="flex flex-col gap-4 self-start p-5">
        <p className="font-medium">Revisar marcações</p>
        <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-6" role="list" aria-label="Questões da tentativa">
          {qs.map((_, i) => (
            <button
              key={i}
              role="listitem"
              onClick={() => goTo(i)}
              aria-label={`Questão ${i + 1}${attempt.picks[i] !== null ? ', respondida' : ', sem resposta'}`}
              className={cn(
                'num h-9 rounded-lg text-xs font-medium',
                i === attempt.idx ? 'ring-2 ring-lilac' : '',
                attempt.picks[i] !== null ? 'bg-purple/25 text-text' : 'bg-surface-2 text-muted',
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted">{qs.length - answered} sem resposta. Sem resposta conta como erro.</p>
        <div className="flex flex-col gap-2">
          <Button variant="primary" onClick={() => finish(false)}>Finalizar simulado</Button>
          <Button variant="danger" onClick={() => { if (window.confirm('Abandonar a tentativa? As respostas desta tentativa serão descartadas.')) save(null); }}>
            Abandonar tentativa
          </Button>
        </div>
        <p className="text-[11px] text-muted">A tentativa fica salva neste navegador. Você pode fechar a página e retomar depois.</p>
      </Card>
    </div>
  );
}

const ESSAY_LINES = 30;

function Essay() {
  const { me, dispatch } = useStore();
  const draftKey = me ? `missao11:draft:${me.id}` : '';
  const [theme, setTheme] = useState('');
  const [text, setText] = useState(() => (draftKey ? localStorage.getItem(draftKey) ?? '' : ''));
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  if (!me) return null;

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estLines = Math.round(words / 10);
  const inRange = estLines >= 20 && estLines <= 30;
  const lines = Math.max(ESSAY_LINES, text.split('\n').length);

  const onText = (v: string) => {
    setText(v);
    localStorage.setItem(draftKey, v); // rascunho salvo a cada alteração
    setSavedAt(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  };

  const save = () => {
    dispatch({
      type: 'save-essay',
      essay: { id: `ess-${Date.now()}`, date: todayISO(), theme: theme.trim() || 'Tema livre', text, checklist: checks },
    });
    localStorage.removeItem(draftKey);
    setText('');
    setTheme('');
    setChecks({});
    setSavedAt(null);
  };

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="flex min-w-0 flex-col gap-4">
        <Field label="Tema" hint="Anote o tema que você recebeu no treino.">
          <input className={inputClass} value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Ex.: o papel do Legislativo municipal" />
        </Field>
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="text-sm font-medium">Texto</span>
          <div className="flex max-h-[32rem] min-w-0 overflow-hidden rounded-xl border border-line bg-surface-2 focus-within:border-lilac">
            <div aria-hidden className="num select-none overflow-hidden border-r border-line px-2 py-2.5 text-right text-xs leading-[1.75rem] text-muted" style={{ minWidth: 40 }}>
              {Array.from({ length: lines }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              className="min-h-[52rem] min-w-0 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-[1.75rem] focus:outline-none"
              value={text}
              onChange={(e) => onText(e.target.value)}
              placeholder="Escreva ou cole o texto. Na prova a redação é manuscrita, em caneta azul ou preta."
              aria-label="Texto da redação, com linhas numeradas"
            />
          </div>
        </div>
        <div className="num flex flex-wrap items-center gap-3 text-sm">
          <Pill tone={inRange ? 'mint' : 'amber'}>≈ {estLines} linhas</Pill>
          <span className="text-muted">{words} palavras. Estimativa de 10 palavras por linha; a quebra da tela pode diferir da folha manuscrita. Meta: 20 a 30 linhas.</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" disabled={!text.trim()} onClick={save}>Salvar redação</Button>
          {savedAt && <span className="text-xs text-muted">Rascunho salvo às {savedAt}</span>}
        </div>
      </Card>

      <div className="flex min-w-0 flex-col gap-4">
        <Card className="flex flex-col gap-3">
          <p className="font-medium">Lista de revisão</p>
          <p className="text-xs text-muted">Critérios do edital: conteúdo vale até 80 pontos e correção formal até 20.</p>
          {CHECKLIST_ESSAY.map((item) => (
            <label key={item} className="flex cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-[#845eff]" checked={!!checks[item]} onChange={(e) => setChecks((c) => ({ ...c, [item]: e.target.checked }))} />
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
                <p className="num text-xs text-muted">{formatDate(e.date)}, {e.text.trim().split(/\s+/).filter(Boolean).length} palavras</p>
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
