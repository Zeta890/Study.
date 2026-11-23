export type ProfileId = 'pedro' | 'elizabeth';

export type AreaId = 'basicos' | 'gerais' | 'especificos';

export interface Subject {
  id: string;
  area: AreaId;
  name: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
}

export type TopicStatus = 'todo' | 'studying' | 'done';

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  statement: string;
  options: string[];
  answer: number; // índice da alternativa correta
  explanation: string;
  origin: 'exemplo' | 'importada';
  difficulty?: 'facil' | 'medio' | 'dificil';
  source?: string; // fonte verificável, quando houver
  reviewedAt?: string; // data da última revisão do gabarito
}

export interface AnswerRecord {
  questionId: string;
  subjectId: string;
  topicId: string;
  correct: boolean;
  mode: 'treino' | 'diagnostico' | 'simulado';
  date: string; // YYYY-MM-DD (America/Cuiaba)
}

export interface ReviewCard {
  box: number; // 1..5 (método Leitner)
  due: string; // YYYY-MM-DD
}

export interface SimuladoResult {
  id: string;
  date: string;
  label: string;
  total: number;
  correct: number;
  minutes: number;
  bySubject: Record<string, { total: number; correct: number }>;
  estimatedScore: number;
}

export interface Essay {
  id: string;
  date: string;
  theme: string;
  text: string;
  checklist: Record<string, boolean>;
}

export interface StudyLog {
  activityId: string;
  date: string;
  minutes: number;
  subjectId: string;
}

export type ActivityKind = 'estudo' | 'revisao' | 'questoes' | 'redacao' | 'simulado';
export type ActivityStatus = 'pending' | 'done' | 'unscheduled';

export interface Activity {
  id: string;
  date: string;
  kind: ActivityKind;
  subjectId: string;
  topicId?: string;
  minutes: number;
  status: ActivityStatus;
  reason?: string; // motivo do replanejamento, quando houver
}

export interface Availability {
  defaultMinutes: number;
  overrides: Record<string, number>; // data -> minutos líquidos
}

export interface TimerState {
  activityId: string;
  accumulatedMs: number;
  startedAt: number | null; // null = pausado
}

export interface PersonData {
  id: ProfileId;
  displayName: string;
  startNote: string;
  diagnosticDone: boolean;
  weakSubjects: string[];
  availability: Availability;
  answers: AnswerRecord[];
  reviews: Record<string, ReviewCard>;
  simulados: SimuladoResult[];
  essays: Essay[];
  studyLog: StudyLog[];
  topicStatus: Record<string, TopicStatus>;
  notes: Record<string, string>;
  plan: Activity[];
  shareProgress: boolean;
  timer: TimerState | null;
}

export interface SharedGoal {
  id: string;
  title: string;
  metric: 'questoes' | 'minutos';
  target: number;
  deadline: string;
  createdBy: ProfileId;
}

export interface SharedState {
  goals: SharedGoal[];
  customQuestions: Question[];
}

export interface AppState {
  version: 1;
  session: ProfileId | null;
  people: Record<ProfileId, PersonData>;
  shared: SharedState;
}
