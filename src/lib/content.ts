import type { AreaId, Subject } from './types';

// Estrutura de conteúdos do edital nº 001/2026-CMC (Câmara Municipal de Cuiabá).
// Os nomes das disciplinas de Conhecimentos Básicos e Gerais seguem o resumo do Anexo V.
// Os itens de Conhecimentos Específicos vieram do plano do projeto e NÃO foram conferidos
// literalmente: o resumo do edital cita 13 itens para Técnico Legislativo. Conferir antes de usar
// como base de estudo oficial.

export const EXAM = {
  name: 'Câmara Municipal de Cuiabá — Técnico Legislativo (sem especialidade)',
  banca: 'Instituto Selecon',
  date: '2026-12-20',
  // Horário da prova ainda não confirmado: o Cartão de Confirmação traz o horário exato.
  // Usamos 13:00 (turno da tarde) apenas como referência para o contador.
  startTime: '13:00',
  prepStart: '2026-11-23',
  prepEnd: '2026-12-19',
  vacancies: 11,
  tz: 'America/Cuiaba',
};

export const AREAS: Record<AreaId, { label: string; points: number; questions: number; pointsEach: number }> = {
  basicos: { label: 'Conhecimentos Básicos', points: 15, questions: 15, pointsEach: 1 },
  gerais: { label: 'Conhecimentos Gerais', points: 15, questions: 15, pointsEach: 1 },
  especificos: { label: 'Conhecimentos Específicos', points: 70, questions: 40, pointsEach: 1.75 },
};

export const SUBJECTS: Subject[] = [
  {
    id: 'lp', area: 'basicos', name: 'Língua Portuguesa',
    topics: [
      { id: 'lp-leitura', name: 'Leitura e interpretação' },
      { id: 'lp-morfo', name: 'Morfossintaxe' },
      { id: 'lp-sem', name: 'Semântica' },
      { id: 'lp-pont', name: 'Pontuação e textualidade' },
    ],
  },
  {
    id: 'rlm', area: 'basicos', name: 'Raciocínio Lógico e Matemático',
    topics: [
      { id: 'rlm-conj', name: 'Conjuntos' },
      { id: 'rlm-num', name: 'Raciocínio numérico' },
      { id: 'rlm-prop', name: 'Proposições e argumentação' },
      { id: 'rlm-quant', name: 'Quantificadores e contagem' },
    ],
  },
  {
    id: 'info', area: 'basicos', name: 'Noções de Informática',
    topics: [
      { id: 'info-hw', name: 'Hardware e software' },
      { id: 'info-office', name: 'Pacotes de escritório' },
      { id: 'info-rede', name: 'Redes, nuvem e segurança' },
      { id: 'info-lgpd', name: 'LGPD' },
    ],
  },
  {
    id: 'leg', area: 'basicos', name: 'Legislação municipal',
    topics: [
      { id: 'leg-lo', name: 'Lei Orgânica de Cuiabá' },
      { id: 'leg-ri', name: 'Regimento Interno da Câmara' },
      { id: 'leg-lc93', name: 'Lei Complementar nº 93/2003' },
      { id: 'leg-lc235', name: 'Lei Complementar nº 235/2011 e alterações (LC 609/2026)' },
    ],
  },
  {
    id: 'mt', area: 'gerais', name: 'História e Geografia de Mato Grosso',
    topics: [
      { id: 'mt-hist', name: 'Períodos colonial, imperial e republicano' },
      { id: 'mt-geo', name: 'Aspectos geográficos e socioeconômicos' },
    ],
  },
  {
    id: 'etica', area: 'gerais', name: 'Noções de Ética e Filosofia',
    topics: [
      { id: 'etica-fund', name: 'Fundamentos da filosofia' },
      { id: 'etica-cid', name: 'Ética, cidadania e liberdade' },
    ],
  },
  {
    id: 'relint', area: 'gerais', name: 'Relações Interpessoais',
    topics: [
      { id: 'relint-com', name: 'Comunicação e empatia' },
      { id: 'relint-atend', name: 'Atendimento ao público e postura profissional' },
    ],
  },
  {
    id: 'esp', area: 'especificos', name: 'Conhecimentos Específicos — Técnico Legislativo',
    topics: [
      { id: 'esp-adm', name: 'Estado, governo e administração pública' },
      { id: 'esp-orgadm', name: 'Organização administrativa e entes' },
      { id: 'esp-agentes', name: 'Órgãos e agentes públicos' },
      { id: 'esp-dadm', name: 'Direito Administrativo: princípios, poderes e atos' },
      { id: 'esp-controle', name: 'Controle da Administração e responsabilidade civil' },
      { id: 'esp-df', name: 'Direitos e garantias fundamentais' },
      { id: 'esp-ds', name: 'Direitos sociais e cidadania' },
      { id: 'esp-cf', name: 'Administração Pública na Constituição Federal' },
      { id: 'esp-leg', name: 'Organização e funcionamento do Legislativo Municipal' },
      { id: 'esp-camara', name: 'Câmara, Mesa Diretora, Plenário e comissões' },
      { id: 'esp-proc', name: 'Processo legislativo e técnica legislativa' },
      { id: 'esp-redacao', name: 'Redação oficial' },
      { id: 'esp-arq', name: 'Arquivologia' },
      { id: 'esp-atend', name: 'Atendimento ao público e relações interpessoais' },
      { id: 'esp-cont', name: 'Contabilidade aplicada ao setor público' },
      { id: 'esp-hst', name: 'Higiene e segurança do trabalho' },
    ],
  },
];

export const ALL_TOPICS = SUBJECTS.flatMap((s) => s.topics.map((t) => ({ ...t, subjectId: s.id })));

export const subjectById = (id: string) => SUBJECTS.find((s) => s.id === id);
export const topicById = (id: string) => ALL_TOPICS.find((t) => t.id === id);

export const CHECKLIST_ESSAY = [
  'Tema específico do cargo, sem tangenciar',
  'Introdução com a tese ou o objetivo do texto',
  'Desenvolvimento com argumentos e exemplos',
  'Conclusão que fecha a ideia',
  'Dentro de 20 a 30 linhas',
  'Letra legível, em caneta azul ou preta',
  'Nenhuma marca que identifique o candidato',
  'Revisão de ortografia, concordância e pontuação',
];
