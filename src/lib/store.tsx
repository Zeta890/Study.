import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { todayISO } from './dates';
import { buildPlan, replan } from './plan';
import type {
  AnswerRecord, AppState, Essay, PersonData, ProfileId, Question, ReviewCard, SharedGoal,
  SimuladoResult, TopicStatus,
} from './types';
import { bySubject } from './stats';

const STORAGE_KEY = 'missao11:v1';

// Intervalos do método Leitner, em dias, por caixa.
const LEITNER_DAYS = [1, 3, 7, 14, 30];

function emptyPerson(id: ProfileId, displayName: string, startNote: string, weakSubjects: string[]): PersonData {
  return {
    id,
    displayName,
    startNote,
    diagnosticDone: false,
    weakSubjects,
    availability: { defaultMinutes: 180, overrides: {} },
    answers: [],
    reviews: {},
    simulados: [],
    essays: [],
    studyLog: [],
    topicStatus: {},
    notes: {},
    plan: [],
    shareProgress: true,
  };
}

function seedState(): AppState {
  const pedro = emptyPerson('pedro', 'Pedro', 'Iniciante, sujeito a diagnóstico', ['rlm']);
  const elizabeth = emptyPerson('elizabeth', 'Elizabeth', 'Nível ainda não avaliado: faça o diagnóstico', []);
  return {
    version: 1,
    session: null,
    people: {
      pedro: { ...pedro, plan: buildPlan(pedro) },
      elizabeth: { ...elizabeth, plan: buildPlan(elizabeth) },
    },
    shared: { goals: [], customQuestions: [] },
  };
}

export type Action =
  | { type: 'login'; id: ProfileId }
  | { type: 'logout' }
  | { type: 'answer'; record: AnswerRecord; correct: boolean; questionId: string }
  | { type: 'diagnostic-done' }
  | { type: 'complete-activity'; activityId: string; minutes: number; subjectId: string; date: string }
  | { type: 'undo-activity'; activityId: string }
  | { type: 'topic-status'; topicId: string; status: TopicStatus }
  | { type: 'note'; topicId: string; text: string }
  | { type: 'save-simulado'; result: SimuladoResult }
  | { type: 'save-essay'; essay: Essay }
  | { type: 'set-availability'; date?: string; minutes: number }
  | { type: 'remove-override'; date: string }
  | { type: 'replan' }
  | { type: 'add-goal'; goal: SharedGoal }
  | { type: 'delete-goal'; id: string }
  | { type: 'toggle-share' }
  | { type: 'import-questions'; questions: Question[] }
  | { type: 'reset-person' };

function updatePerson(state: AppState, id: ProfileId, fn: (p: PersonData) => PersonData): AppState {
  return { ...state, people: { ...state.people, [id]: fn(state.people[id]) } };
}

function reducer(state: AppState, action: Action): AppState {
  const id = state.session;
  switch (action.type) {
    case 'login':
      return { ...state, session: action.id };
    case 'logout':
      return { ...state, session: null };

    case 'answer': {
      if (!id) return state;
      return updatePerson(state, id, (p) => {
        const prev = p.reviews[action.questionId];
        const box = action.correct ? Math.min(5, (prev?.box ?? 0) + 1) : 1;
        const days = LEITNER_DAYS[box - 1];
        const card: ReviewCard = { box, due: addDaysSafe(action.record.date, days) };
        return { ...p, answers: [...p.answers, action.record], reviews: { ...p.reviews, [action.questionId]: card } };
      });
    }

    case 'diagnostic-done': {
      if (!id) return state;
      return updatePerson(state, id, (p) => {
        const bySub = bySubject(p.answers.filter((a) => a.mode === 'diagnostico'));
        const weak = Object.entries(bySub).filter(([, r]) => r.total > 0 && r.pct < 60).map(([s]) => s);
        const next = { ...p, diagnosticDone: true, weakSubjects: Array.from(new Set([...p.weakSubjects, ...weak])) };
        return replan(rebuild(next), todayISO());
      });
    }

    case 'complete-activity': {
      if (!id) return state;
      return updatePerson(state, id, (p) => {
        const done = p.studyLog.some((l) => l.activityId === action.activityId);
        const plan = p.plan.map((a) => (a.id === action.activityId ? { ...a, status: 'done' as const } : a));
        const log = done ? p.studyLog : [...p.studyLog, { activityId: action.activityId, date: todayISO(), minutes: action.minutes, subjectId: action.subjectId }];
        return { ...p, plan, studyLog: log };
      });
    }

    case 'undo-activity': {
      if (!id) return state;
      return updatePerson(state, id, (p) => ({
        ...p,
        plan: p.plan.map((a) => (a.id === action.activityId ? { ...a, status: 'pending' as const } : a)),
        studyLog: p.studyLog.filter((l) => l.activityId !== action.activityId),
      }));
    }

    case 'topic-status': {
      if (!id) return state;
      return updatePerson(state, id, (p) => ({ ...p, topicStatus: { ...p.topicStatus, [action.topicId]: action.status } }));
    }

    case 'note': {
      if (!id) return state;
      return updatePerson(state, id, (p) => ({ ...p, notes: { ...p.notes, [action.topicId]: action.text } }));
    }

    case 'save-simulado': {
      if (!id) return state;
      return updatePerson(state, id, (p) => ({ ...p, simulados: [...p.simulados, action.result] }));
    }

    case 'save-essay': {
      if (!id) return state;
      return updatePerson(state, id, (p) => ({ ...p, essays: [action.essay, ...p.essays] }));
    }

    case 'set-availability': {
      if (!id) return state;
      return updatePerson(state, id, (p) => {
        const next = action.date
          ? { ...p, availability: { ...p.availability, overrides: { ...p.availability.overrides, [action.date!]: action.minutes } } }
          : { ...p, availability: { ...p.availability, defaultMinutes: action.minutes } };
        return replan(rebuild(next), todayISO());
      });
    }

    case 'remove-override': {
      if (!id) return state;
      return updatePerson(state, id, (p) => {
        const overrides = { ...p.availability.overrides };
        delete overrides[action.date];
        return replan(rebuild({ ...p, availability: { ...p.availability, overrides } }), todayISO());
      });
    }

    case 'replan':
      if (!id) return state;
      return updatePerson(state, id, (p) => replan(p, todayISO()));

    case 'add-goal':
      return { ...state, shared: { ...state.shared, goals: [...state.shared.goals, action.goal] } };
    case 'delete-goal':
      return { ...state, shared: { ...state.shared, goals: state.shared.goals.filter((g) => g.id !== action.id) } };

    case 'toggle-share':
      if (!id) return state;
      return updatePerson(state, id, (p) => ({ ...p, shareProgress: !p.shareProgress }));

    case 'import-questions': {
      const existing = new Set(state.shared.customQuestions.map((q) => q.id));
      const fresh = action.questions.filter((q) => !existing.has(q.id));
      return { ...state, shared: { ...state.shared, customQuestions: [...state.shared.customQuestions, ...fresh] } };
    }

    case 'reset-person': {
      if (!id) return state;
      return updatePerson(state, id, (p) => {
        const base = emptyPerson(p.id, p.displayName, p.startNote, p.id === 'pedro' ? ['rlm'] : []);
        return { ...base, plan: buildPlan(base) };
      });
    }
  }
}

// Recalcula o cronograma a partir de hoje, preservando os dias já passados.
function rebuild(p: PersonData): PersonData {
  const today = todayISO();
  const past = p.plan.filter((a) => a.date < today);
  const fresh = buildPlan(p).filter((a) => a.date >= today);
  return { ...p, plan: [...past, ...fresh] };
}

function addDaysSafe(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function load(): AppState {
  const seed = seedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.version !== 1 || !parsed.people) return seed;
    // Garante plano para quem ainda não tem cronograma gerado.
    for (const pid of ['pedro', 'elizabeth'] as ProfileId[]) {
      if (!parsed.people[pid].plan?.length) parsed.people[pid].plan = buildPlan(parsed.people[pid]);
    }
    return parsed;
  } catch {
    return seed;
  }
}

interface StoreValue {
  state: AppState;
  dispatch: (a: Action) => void;
  me: PersonData | undefined;
  allQuestions: Question[];
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children, bank }: { children: ReactNode; bank: Question[] }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const s = load();
    // Ao abrir o app, replaneja atividades pendentes de dias anteriores.
    const today = todayISO();
    return {
      ...s,
      people: {
        pedro: replan(s.people.pedro, today),
        elizabeth: replan(s.people.elizabeth, today),
      },
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Armazenamento cheio ou bloqueado: o app segue funcionando sem persistir.
    }
  }, [state]);

  const value = useMemo<StoreValue>(() => {
    const me = state.session ? state.people[state.session] : undefined;
    return {
      state,
      dispatch,
      me,
      allQuestions: [...bank, ...state.shared.customQuestions],
    };
  }, [state, bank]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore precisa estar dentro de StoreProvider');
  return ctx;
}

