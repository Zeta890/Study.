import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, ChevronDown, CircleDot, Circle } from 'lucide-react';
import { useStore } from '../lib/store';
import { AREAS, SUBJECTS, subjectById } from '../lib/content';
import { DIAGNOSTIC_IDS } from '../lib/bank';
import { pickNext, dueReviews, bySubject, ratio } from '../lib/stats';
import { todayISO } from '../lib/dates';
import { validateBank } from '../lib/validate';
import { Bar, Button, Card, Empty, Field, Pill, inputClass } from '../components/ui';
import { PageHeader } from '../components/Layout';
import { cn } from '../components/cn';
import type { AnswerRecord, AreaId, Question, TopicStatus, Subject } from '../lib/types';

type Tab = 'conteudo' | 'questoes' | 'revisao' | 'diagnostico' | 'importar';
const TABS: { id: Tab; label: string }[] = [
  { id: 'conteudo', label: 'Conteúdo' },
  { id: 'questoes', label: 'Questões' },
  { id: 'revisao', label: 'Revisão' },
  { id: 'diagnostico', label: 'Diagnóstico' },
  { id: 'importar', label: 'Importar' },
];

export default function Study() {
  const [params, setParams] = useSearchParams();
  const tab = (TABS.find((t) => t.id === params.get('aba'))?.id ?? (params.get('aba') === 'revisao' ? 'revisao' : 'conteudo')) as Tab;
  const setTab = (t: Tab) => {
    const next = new URLSearchParams(params);
    next.set('aba', t);
    setParams(next, { replace: true });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Estudo"
        description="Conteúdo do edital, questões, revisão espaçada e diagnóstico. Os assuntos seguem o Anexo V; confira os itens de Específicos antes de usar como roteiro oficial."
      />
      <div role="tablist" aria-label="Seções de estudo" className="flex flex-wrap gap-1 rounded-2xl border border-line bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors',
              tab === t.id ? 'bg-purple text-white' : 'text-muted hover:text-text',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'conteudo' && <Content />}
      {tab === 'questoes' && <Practice />}
      {tab === 'revisao' && <Reviews />}
      {tab === 'diagnostico' && <Diagnostic />}
      {tab === 'importar' && <ImportBank />}
    </div>
  );
}

function Content() {
  const { me, dispatch } = useStore();
  const [params] = useSearchParams();
  const q = (params.get('q') ?? '').toLowerCase();
  const focusSubject = params.get('subject');
  const [open, setOpen] = useState<string | null>(focusSubject ?? 'esp');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(params.get('topic'));
  if (!me) return null;

  const groups: { area: AreaId; label: string; subjects: Subject[] }[] = (Object.keys(AREAS) as AreaId[]).map((area) => ({
    area,
    label: AREAS[area].label,
    subjects: SUBJECTS.filter((s) => s.area === area && (!q || s.name.toLowerCase().includes(q) || s.topics.some((t) => t.name.toLowerCase().includes(q)))),
  }));

  const cycle = (topicId: string) => {
    const current: TopicStatus = me.topicStatus[topicId] ?? 'todo';
    const next: TopicStatus = current === 'todo' ? 'studying' : current === 'studying' ? 'done' : 'todo';
    dispatch({ type: 'topic-status', topicId, status: next });
  };

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex flex-col gap-6">
        {groups.map((g) => (
          <section key={g.area} aria-label={g.label} className="flex flex-col gap-2">
            <h2 className="text-base font-semibold">{g.label}</h2>
            {g.subjects.length === 0 && <p className="text-sm text-muted">Nenhum assunto encontrado para essa busca.</p>}
            {g.subjects.map((s) => {
              const isOpen = open === s.id;
              const doneCount = s.topics.filter((t) => me.topicStatus[t.id] === 'done').length;
              const subjectRatio = bySubject(me.answers)[s.id] ?? ratio(0, 0);
              return (
                <Card key={s.id} className="p-0">
                  <button
                    onClick={() => setOpen(isOpen ? null : s.id)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{s.name}</p>
                      <p className="num mt-0.5 text-xs text-muted">
                        {doneCount} de {s.topics.length} assuntos concluídos
                        {subjectRatio.total > 0 && ` · ${subjectRatio.pct}% de acerto`}
                      </p>
                    </div>
                    <div className="hidden w-28 sm:block">
                      <Bar pct={(doneCount / s.topics.length) * 100} />
                    </div>
                    <ChevronDown size={18} className={cn('text-muted transition-transform', isOpen && 'rotate-180')} aria-hidden />
                  </button>
                  {isOpen && (
                    <ul className="flex flex-col border-t border-line">
                      {s.topics.map((t) => {
                        const st = me.topicStatus[t.id] ?? 'todo';
                        const Icon = st === 'done' ? CheckCircle2 : st === 'studying' ? CircleDot : Circle;
                        const active = selectedTopic === t.id;
                        return (
                          <li key={t.id} className={cn('flex items-center gap-3 border-b border-line/60 px-5 py-3 last:border-0', active && 'bg-purple/[0.07]')}>
                            <button
                              onClick={() => cycle(t.id)}
                              className="shrink-0"
                              aria-label={`Alterar status de ${t.name}: ${labelStatus(st)}`}
                            >
                              <Icon size={19} className={st === 'done' ? 'text-mint' : st === 'studying' ? 'text-amber' : 'text-muted'} />
                            </button>
                            <button onClick={() => setSelectedTopic(t.id)} className="min-w-0 flex-1 text-left text-sm">
                              {t.name}
                            </button>
                            <Pill tone={st === 'done' ? 'mint' : st === 'studying' ? 'amber' : 'neutral'}>{labelStatus(st)}</Pill>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </Card>
              );
            })}
          </section>
        ))}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <TopicNotes subject={focusSubject ? subjectById(focusSubject) : undefined} topicId={selectedTopic} />
      </aside>
    </div>
  );
}

function labelStatus(s: TopicStatus) {
  return s === 'done' ? 'Concluído' : s === 'studying' ? 'Estudando' : 'Não iniciado';
}

function TopicNotes({ subject, topicId }: { subject?: Subject; topicId: string | null }) {
  const { me, dispatch } = useStore();
  const topic = subject?.topics.find((t) => t.id === topicId) ?? subject?.topics[0];
  const [draft, setDraft] = useState<string | null>(null);
  if (!me) return null;
  if (!topic) {
    return (
      <Card>
        <p className="text-sm text-muted">Escolha um assunto para ver e registrar anotações.</p>
      </Card>
    );
  }
  const value = draft ?? me.notes[topic.id] ?? '';
  return (
    <Card className="flex flex-col gap-3">
      <p className="text-xs text-muted">Anotações</p>
      <p className="font-medium">{topic.name}</p>
      <Field label="Anotações pessoais" hint="Salvas quando você sai do campo.">
        <textarea
          className={cn(inputClass, 'min-h-40 resize-y leading-relaxed')}
          value={value}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            if (draft !== null) dispatch({ type: 'note', topicId: topic.id, text: draft });
            setDraft(null);
          }}
          placeholder="Resuma o assunto com as suas palavras, anote regras e exceções."
        />
      </Field>
    </Card>
  );
}

function QuestionView({
  question, mode, onAnswer, onNext, nextLabel = 'Próxima questão',
}: {
  question: Question;
  mode: AnswerRecord['mode'];
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  const [choice, setChoice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const { dispatch, me } = useStore();
  const correct = choice === question.answer;
  const subject = subjectById(question.subjectId);

  const confirm = () => {
    if (choice === null || !me || revealed) return;
    setRevealed(true);
    dispatch({
      type: 'answer',
      questionId: question.id,
      correct,
      record: {
        questionId: question.id,
        subjectId: question.subjectId,
        topicId: question.topicId,
        correct,
        mode,
        date: todayISO(),
      },
    });
    onAnswer(correct);
  };

  return (
    <Card as="article" className="flex flex-col gap-5 p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="purple">{subject?.name}</Pill>
        {question.origin === 'exemplo' && <Pill tone="neutral">Exemplo do app</Pill>}
      </div>
      <p className="text-base leading-relaxed">{question.statement}</p>
      <div role="radiogroup" aria-label="Alternativas" className="flex flex-col gap-2">
        {question.options.map((opt, i) => {
          const isAnswer = revealed && i === question.answer;
          const isWrongPick = revealed && i === choice && i !== question.answer;
          return (
            <button
              key={i}
              role="radio"
              aria-checked={choice === i}
              disabled={revealed}
              onClick={() => setChoice(i)}
              className={cn(
                'flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors',
                choice === i && !revealed ? 'border-purple bg-purple/10' : 'border-line hover:bg-surface-2',
                isAnswer && 'border-mint bg-mint/10',
                isWrongPick && 'border-[#ff8a8a] bg-[#ff8a8a]/10',
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
      {revealed ? (
        <div className="flex flex-col gap-3 rounded-xl bg-surface-2 p-4 text-sm">
          <p className={cn('font-medium', correct ? 'text-mint' : 'text-[#ff9b9b]')}>
            {correct ? 'Resposta correta.' : `Resposta: ${String.fromCharCode(65 + question.answer)}.`}
          </p>
          <p className="leading-relaxed text-muted">{question.explanation}</p>
          <div>
            <Button variant="primary" onClick={onNext}>{nextLabel}</Button>
          </div>
        </div>
      ) : (
        <div>
          <Button variant="primary" disabled={choice === null} onClick={confirm}>Confirmar resposta</Button>
        </div>
      )}
    </Card>
  );
}

function Practice() {
  const { me, allQuestions } = useStore();
  const [params] = useSearchParams();
  const [subjectId, setSubjectId] = useState<string>(params.get('subject') ?? 'lp');
  const pool = allQuestions.filter((q) => q.subjectId === subjectId);
  const pick = (sid: string) => (me ? pickNext(allQuestions, me, { subjectId: sid }) : undefined);
  // A questão atual fica fixa até o aluno avançar, para a explicação não sumir.
  const [question, setQuestion] = useState<Question | undefined>(() => pick(subjectId));
  if (!me) return null;

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <Card className="flex flex-col gap-2 p-3">
        <p className="px-2 pb-1 text-xs text-muted">Disciplina</p>
        {SUBJECTS.map((s) => {
          const n = allQuestions.filter((q) => q.subjectId === s.id).length;
          return (
            <button
              key={s.id}
              onClick={() => { setSubjectId(s.id); setQuestion(pick(s.id)); }}
              className={cn(
                'flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm',
                subjectId === s.id ? 'bg-purple/15 text-text' : 'text-muted hover:bg-surface-2 hover:text-text',
              )}
            >
              <span className="truncate">{s.name}</span>
              <span className="num text-xs">{n}</span>
            </button>
          );
        })}
      </Card>
      <div className="flex flex-col gap-4">
        {pool.length === 0 ? (
          <Empty
            title="Sem questões para esta disciplina"
            text="Importe um banco de questões na aba Importar. O app inclui poucas questões de exemplo, só para testar o fluxo."
          />
        ) : question ? (
          <QuestionView
            key={question.id}
            question={question}
            mode="treino"
            onAnswer={() => undefined}
            onNext={() => setQuestion(pick(subjectId))}
          />
        ) : null}
      </div>
    </div>
  );
}

function Reviews() {
  const { me, allQuestions } = useStore();
  const dueList = (): Question[] => {
    if (!me) return [];
    const ids = new Set(dueReviews(me));
    return allQuestions.filter((q) => ids.has(q.id));
  };
  const [question, setQuestion] = useState<Question | undefined>(() => dueList()[0]);
  const due = dueList();
  if (!me) return null;

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="flex flex-col gap-4">
        {due.length === 0 || !question ? (
          <Empty
            title="Nenhuma revisão vencida"
            text="Quando você acerta uma questão, ela volta depois de 1, 3, 7, 14 e 30 dias. Errar faz voltar para o começo."
          />
        ) : (
          <QuestionView
            key={question.id}
            question={question}
            mode="treino"
            nextLabel="Próxima revisão"
            onAnswer={() => undefined}
            onNext={() => setQuestion(dueList()[0])}
          />
        )}
      </div>
      <Card className="flex flex-col gap-3">
        <p className="font-medium">Caixas de revisão</p>
        <p className="text-sm text-muted">Quanto mais alta a caixa, mais tempo até a próxima revisão.</p>
        <ul className="flex flex-col gap-2 text-sm">
          {[1, 2, 3, 4, 5].map((b) => {
            const n = Object.values(me.reviews).filter((c) => c.box === b).length;
            return (
              <li key={b} className="flex justify-between">
                <span className="text-muted">Caixa {b}</span>
                <span className="num font-medium">{n}</span>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

function Diagnostic() {
  const { me, allQuestions, dispatch } = useStore();
  const questions = DIAGNOSTIC_IDS.map((id) => allQuestions.find((q) => q.id === id)).filter(Boolean) as Question[];
  const firstOpen = (): Question | undefined => {
    const done = new Set((me?.answers ?? []).filter((a) => a.mode === 'diagnostico').map((a) => a.questionId));
    return questions.find((q) => !done.has(q.id));
  };
  const [current, setCurrent] = useState<Question | undefined>(firstOpen);
  if (!me) return null;
  const answered = me.answers.filter((a) => a.mode === 'diagnostico');
  const acc = ratio(answered.filter((a) => a.correct).length, answered.length);

  if (me.diagnosticDone) {
    const bySub = bySubject(answered);
    const evaluated = Object.keys(bySub);
    const strengths = evaluated.filter((s) => bySub[s].total >= 3 && bySub[s].pct >= 70);
    const weak = evaluated.filter((s) => bySub[s].total >= 2 && bySub[s].pct < 60);
    const notEvaluated = SUBJECTS.filter((s) => !evaluated.includes(s.id));
    const nameOf = (id: string) => subjectById(id)?.name ?? id;
    return (
      <Card className="flex flex-col gap-5 p-6">
        <div>
          <p className="font-medium">Diagnóstico concluído</p>
          <p className="text-sm text-muted">Acerto geral de {acc.pct}% em {answered.length} questões. A trilha foi recalculada a partir destes resultados.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium">Pontos fortes</p>
            {strengths.length
              ? <div className="flex flex-wrap gap-2">{strengths.map((s) => <Pill key={s} tone="mint">{nameOf(s)}</Pill>)}</div>
              : <p className="text-sm text-muted">Sem amostra suficiente ainda (mínimo de 3 questões com 70% de acerto).</p>}
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Pontos fracos</p>
            {weak.length
              ? <div className="flex flex-wrap gap-2">{weak.map((s) => <Pill key={s} tone="amber">{nameOf(s)}</Pill>)}</div>
              : <p className="text-sm text-muted">Nenhuma disciplina abaixo de 60% com amostra mínima.</p>}
          </div>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">Não avaliadas</p>
          <p className="text-sm text-muted">Ausência de questões no diagnóstico não significa domínio.</p>
          <div className="mt-2 flex flex-wrap gap-2">{notEvaluated.map((s) => <Pill key={s.id} tone="neutral">{s.name}</Pill>)}</div>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">Recomendação</p>
          <p className="text-sm text-muted">
            {weak.length
              ? `Comece pelos pontos fracos (${weak.map(nameOf).join(', ')}) e revise as explicações dos erros antes de avançar.`
              : 'Mantenha a trilha padrão e amplie a cobertura das disciplinas não avaliadas.'}
          </p>
        </div>
      </Card>
    );
  }
  if (questions.length === 0) {
    return <Empty title="Sem questões de diagnóstico" text="Importe questões na aba Importar para liberar o diagnóstico." />;
  }
  if (!current) {
    return (
      <Card className="flex flex-col gap-4 p-6">
        <p className="font-medium">Diagnóstico pronto para concluir</p>
        <p className="text-sm text-muted">Acerto de {acc.pct}% nas {answered.length} questões. Ao concluir, a trilha é recalculada.</p>
        <div><Button variant="primary" onClick={() => dispatch({ type: 'diagnostic-done' })}>Concluir diagnóstico</Button></div>
      </Card>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="w-full max-w-xs">
          <Bar pct={(answered.length / questions.length) * 100} label={`${answered.length} de ${questions.length} questões`} />
        </div>
      </div>
      <QuestionView key={current.id} question={current} mode="diagnostico" onAnswer={() => undefined} onNext={() => setCurrent(firstOpen())} nextLabel="Próxima" />
    </div>
  );
}

function ImportBank() {
  const { dispatch, allQuestions } = useStore();
  const [text, setText] = useState('');
  const [message, setMessage] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);

  const example = `[
  {
    "id": "minha-1",
    "subjectId": "lp",
    "topicId": "lp-morfo",
    "statement": "Enunciado da questão",
    "options": ["A", "B", "C", "D"],
    "answer": 0,
    "explanation": "Por que a alternativa A é a correta."
  }
]`;

  function importNow() {
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      setMessage({ tone: 'err', text: 'O texto não é JSON válido. Confira vírgulas e aspas.' });
      return;
    }
    if (!Array.isArray(data)) {
      setMessage({ tone: 'err', text: 'O conteúdo precisa ser uma lista JSON de questões.' });
      return;
    }
    // Mesmas regras dos testes automatizados: nenhuma questão entra se alguma estiver inválida.
    const { valid, errors } = validateBank(data);
    if (errors.length) {
      setMessage({ tone: 'err', text: `Nenhuma questão foi importada. ${errors.length} problema(s): ${errors.slice(0, 3).join(' | ')}${errors.length > 3 ? ' ...' : ''}` });
      return;
    }
    dispatch({ type: 'import-questions', questions: valid.map((q) => ({ ...q, origin: 'importada' as const })) });
    setMessage({ tone: 'ok', text: `${valid.length} ${valid.length === 1 ? 'questão importada' : 'questões importadas'}. O banco agora tem ${allQuestions.length + valid.length} questões.` });
    setText('');
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="flex flex-col gap-4">
        <Field label="Banco de questões em JSON" hint="Cole uma lista de questões. Os ids das disciplinas estão na aba Conteúdo.">
          <textarea className={cn(inputClass, 'min-h-72 font-mono text-xs leading-relaxed')} value={text} onChange={(e) => setText(e.target.value)} placeholder={example} spellCheck={false} />
        </Field>
        {message && (
          <p role="status" className={cn('rounded-xl px-4 py-3 text-sm', message.tone === 'ok' ? 'bg-mint/10 text-mint' : 'bg-[#ff8a8a]/10 text-[#ffb3b3]')}>
            {message.text}
          </p>
        )}
        <div><Button variant="primary" disabled={!text.trim()} onClick={importNow}>Importar questões</Button></div>
      </Card>
      <Card className="flex flex-col gap-3 text-sm text-muted">
        <p className="font-medium text-text">Antes de importar</p>
        <p>O app não traz questões oficiais da Selecon. As questões de exemplo servem só para testar o fluxo.</p>
        <p>Use apenas material que você tem direito de usar, e confira o gabarito antes de estudar com ele.</p>
        <p>Os dados ficam guardados neste navegador.</p>
      </Card>
    </div>
  );
}
