import type { PersonData } from '../types';

export function person(overrides: Partial<PersonData> = {}): PersonData {
  return {
    id: 'pedro',
    displayName: 'Pedro',
    startNote: '',
    diagnosticDone: false,
    weakSubjects: ['rlm'],
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
    timer: null,
    ...overrides,
  };
}
