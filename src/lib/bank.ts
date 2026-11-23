import type { Question } from './types';

// Questões de EXEMPLO criadas para testar o app. Não são questões da Selecon nem
// reproduzem provas anteriores. Substitua pelo seu banco, por importação JSON na aba Estudo.
export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'ex-rlm-1', subjectId: 'rlm', topicId: 'rlm-prop', origin: 'exemplo',
    statement: 'Considere: "Todo A é B" e "Nenhum B é C". Com base apenas nessas premissas, é correto afirmar que:',
    options: ['Algum A é C', 'Nenhum A é C', 'Todo C é A', 'Algum C é B'],
    answer: 1,
    explanation: 'Se todo A está dentro de B e nenhum B toca C, nenhum A pode ser C.',
  },
  {
    id: 'ex-rlm-2', subjectId: 'rlm', topicId: 'rlm-prop', origin: 'exemplo',
    statement: 'A negação de "Todos os servidores são efetivos" é:',
    options: ['Nenhum servidor é efetivo', 'Algum servidor não é efetivo', 'Todos os servidores não são efetivos', 'Algum servidor é efetivo'],
    answer: 1,
    explanation: 'A negação de "todo A é B" é "existe pelo menos um A que não é B".',
  },
  {
    id: 'ex-rlm-3', subjectId: 'rlm', topicId: 'rlm-num', origin: 'exemplo',
    statement: 'Quanto é 3/4 de 80?',
    options: ['40', '50', '60', '64'],
    answer: 2,
    explanation: '80 ÷ 4 = 20; 20 × 3 = 60.',
  },
  {
    id: 'ex-rlm-4', subjectId: 'rlm', topicId: 'rlm-conj', origin: 'exemplo',
    statement: 'Em um grupo, 10 pessoas falam inglês, 8 falam espanhol e 3 falam os dois idiomas. Quantas falam pelo menos um dos idiomas?',
    options: ['13', '15', '18', '21'],
    answer: 1,
    explanation: 'Pelo princípio da inclusão-exclusão: 10 + 8 − 3 = 15.',
  },
  {
    id: 'ex-rlm-5', subjectId: 'rlm', topicId: 'rlm-prop', origin: 'exemplo',
    statement: 'Se chove, então a rua fica molhada. A rua não está molhada. Logo:',
    options: ['Chove', 'Não chove', 'A rua está seca e chove', 'Não se pode concluir nada'],
    answer: 1,
    explanation: 'É o modus tollens: se p → q e não q, então não p.',
  },
  {
    id: 'ex-lp-1', subjectId: 'lp', topicId: 'lp-morfo', origin: 'exemplo',
    statement: 'O plural correto de "cidadão" é:',
    options: ['cidadões', 'cidadãos', 'cidadães', 'cidadões'],
    answer: 1,
    explanation: 'Substantivos terminados em -ão têm plurais variados; "cidadão" faz "cidadãos".',
  },
  {
    id: 'ex-lp-2', subjectId: 'lp', topicId: 'lp-sem', origin: 'exemplo',
    statement: 'O antônimo de "antigo", no sentido de "que existe há muito tempo", é:',
    options: ['velho', 'remoto', 'novo', 'antigamente'],
    answer: 2,
    explanation: '"Novo" é o oposto de "antigo" nesse sentido.',
  },
  {
    id: 'ex-lp-3', subjectId: 'lp', topicId: 'lp-morfo', origin: 'exemplo',
    statement: 'Assinale a frase com o verbo corretamente flexionado:',
    options: ['Eles tem razão.', 'Eles têm razão.', 'Eles tém razão.', 'Eles tèm razão.'],
    answer: 1,
    explanation: 'Com sujeito plural, o verbo "ter" na 3ª pessoa leva "têm".',
  },
  {
    id: 'ex-info-1', subjectId: 'info', topicId: 'info-office', origin: 'exemplo',
    statement: 'No Windows, o atalho padrão para copiar um texto selecionado é:',
    options: ['Ctrl + V', 'Ctrl + X', 'Ctrl + C', 'Ctrl + Z'],
    answer: 2,
    explanation: 'Ctrl+C copia; Ctrl+V cola; Ctrl+X recorta; Ctrl+Z desfaz.',
  },
  {
    id: 'ex-info-2', subjectId: 'info', topicId: 'info-hw', origin: 'exemplo',
    statement: 'A memória RAM é classificada como memória:',
    options: ['permanente', 'volátil', 'somente de leitura', 'de backup'],
    answer: 1,
    explanation: 'A RAM perde o conteúdo quando a energia é desligada.',
  },
  {
    id: 'ex-info-3', subjectId: 'info', topicId: 'info-lgpd', origin: 'exemplo',
    statement: 'A Lei Geral de Proteção de Dados Pessoais (LGPD) é a Lei nº:',
    options: ['8.078/1990', '12.527/2011', '13.709/2018', '14.133/2021'],
    answer: 2,
    explanation: 'A LGPD é a Lei nº 13.709, de 14 de agosto de 2018.',
  },
  {
    id: 'ex-lp-4', subjectId: 'lp', topicId: 'lp-pont', origin: 'exemplo',
    statement: 'Em "Estudar, revisar e simular são etapas da preparação", a vírgula após "Estudar" é usada para:',
    options: ['separar o sujeito do predicado', 'separar termos de mesma função sintática', 'indicar uma omissão de verbo', 'isolar um aposto'],
    answer: 1,
    explanation: 'Os verbos "estudar", "revisar" e "simular" exercem a mesma função; as vírgulas enumeram esses termos.',
  },
];

// Sequência de diagnóstico: uma amostra balanceada das três áreas.
export const DIAGNOSTIC_IDS = ['ex-lp-1', 'ex-lp-3', 'ex-rlm-1', 'ex-rlm-3', 'ex-rlm-4', 'ex-info-1', 'ex-info-3', 'ex-rlm-5'];
