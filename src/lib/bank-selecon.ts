import type { Question } from './types';

// Banco enviado pelo usuário: 60 questões INÉDITAS inspiradas no estilo Selecon.
// NÃO são questões oficiais da Selecon e precisam de revisão editorial antes de avaliação oficial.
export const SELECON_INEDITAS: Question[] = [
  {
    "id": "SEL-N-001",
    "subjectId": "lp",
    "topicId": "lp-leitura",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Leia: 'A transparência administrativa não se resume à publicação de dados; exige que as informações sejam compreensíveis ao cidadão.' A ideia central é que a transparência exige:",
    "options": [
      "a divulgação de qualquer dado, mesmo incompreensível.",
      "a compreensão das informações divulgadas.",
      "o sigilo de documentos administrativos.",
      "a publicação exclusiva de relatórios financeiros."
    ],
    "answer": 1,
    "explanation": "O trecho distingue mera publicação de efetiva compreensão das informações.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-002",
    "subjectId": "lp",
    "topicId": "lp-morfo",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Assinale a frase com concordância verbal correta.",
    "options": [
      "Houveram diversas reuniões ontem.",
      "Fazem três anos que o setor foi criado.",
      "Existem documentos pendentes de análise.",
      "Deve haverem novas orientações."
    ],
    "answer": 2,
    "explanation": "O verbo existir concorda com o sujeito 'documentos'; haver impessoal e fazer temporal ficam no singular.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-003",
    "subjectId": "lp",
    "topicId": "lp-pont",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Assinale a alternativa com pontuação adequada.",
    "options": [
      "Os servidores, encaminharam os documentos.",
      "Após a reunião, a comissão divulgou o parecer.",
      "A Câmara, aprovou o projeto ontem.",
      "O relatório foi, entregue ao presidente."
    ],
    "answer": 1,
    "explanation": "A vírgula separa o adjunto adverbial antecipado, sem separar sujeito de verbo.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-004",
    "subjectId": "lp",
    "topicId": "lp-morfo",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Em qual frase o uso da crase está correto?",
    "options": [
      "O documento foi enviado à secretaria.",
      "O servidor chegou à pé.",
      "O relatório refere-se à todos.",
      "A comissão começou à analisar."
    ],
    "answer": 0,
    "explanation": "A preposição 'a' exigida por 'enviado' contrai-se com o artigo feminino de 'secretaria'.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-005",
    "subjectId": "lp",
    "topicId": "lp-pont",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Em 'O parecer foi revisado. Entretanto, ainda havia inconsistências', 'entretanto' expressa:",
    "options": [
      "adição.",
      "conclusão.",
      "oposição.",
      "explicação."
    ],
    "answer": 2,
    "explanation": "'Entretanto' é conectivo adversativo, indicando contraste.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-006",
    "subjectId": "rlm",
    "topicId": "rlm-conj",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Em um grupo de 80 pessoas, 45 estudam Português, 35 estudam Matemática e 15 estudam ambas. Quantas estudam pelo menos uma dessas disciplinas?",
    "options": [
      "50",
      "65",
      "70",
      "80"
    ],
    "answer": 1,
    "explanation": "Pela inclusão-exclusão: 45 + 35 - 15 = 65.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-007",
    "subjectId": "rlm",
    "topicId": "rlm-prop",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "A negação de 'Todos os candidatos revisaram o edital' é:",
    "options": [
      "Nenhum candidato revisou o edital.",
      "Todos os candidatos não revisaram o edital.",
      "Pelo menos um candidato não revisou o edital.",
      "Pelo menos um candidato revisou o edital."
    ],
    "answer": 2,
    "explanation": "Negar uma afirmação universal exige um contraexemplo.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-008",
    "subjectId": "rlm",
    "topicId": "rlm-prop",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "A proposição 'Se estudo, então aprendo' é falsa somente quando:",
    "options": [
      "estudo e não aprendo.",
      "não estudo e aprendo.",
      "não estudo e não aprendo.",
      "estudo e aprendo."
    ],
    "answer": 0,
    "explanation": "Uma implicação P→Q só é falsa com P verdadeira e Q falsa.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-009",
    "subjectId": "rlm",
    "topicId": "rlm-num",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Um candidato acertou 18 de 24 questões. Seu percentual de acertos foi:",
    "options": [
      "60%",
      "70%",
      "75%",
      "80%"
    ],
    "answer": 2,
    "explanation": "18 ÷ 24 = 0,75 = 75%.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-010",
    "subjectId": "rlm",
    "topicId": "rlm-num",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Na sequência 3, 6, 12, 24, o próximo termo é:",
    "options": [
      "30",
      "36",
      "42",
      "48"
    ],
    "answer": 3,
    "explanation": "Cada termo é o dobro do anterior.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-011",
    "subjectId": "info",
    "topicId": "info-rede",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "O phishing consiste principalmente em:",
    "options": [
      "compactar arquivos para economizar espaço.",
      "enganar usuários para obter informações ou induzir ações indevidas.",
      "atualizar automaticamente sistemas operacionais.",
      "criptografar backups legítimos."
    ],
    "answer": 1,
    "explanation": "Phishing é engenharia social que tenta obter dados ou induzir ações fraudulentas.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-012",
    "subjectId": "info",
    "topicId": "info-office",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Em uma planilha, a fórmula =SOMA(A1:A3) realiza:",
    "options": [
      "a soma dos valores de A1 até A3.",
      "a média dos valores de A1 até A3.",
      "a contagem de células vazias.",
      "a concatenação dos textos."
    ],
    "answer": 0,
    "explanation": "SOMA adiciona os valores numéricos no intervalo indicado.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-013",
    "subjectId": "info",
    "topicId": "info-rede",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "HTTPS indica, em condições normais, que a comunicação entre navegador e site:",
    "options": [
      "não pode conter informações falsas.",
      "é protegida por criptografia em trânsito.",
      "dispensa verificação do domínio.",
      "é sempre anônima."
    ],
    "answer": 1,
    "explanation": "HTTPS protege o tráfego em trânsito, mas não garante a legitimidade do conteúdo.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-014",
    "subjectId": "esp",
    "topicId": "esp-cf",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Qual alternativa apresenta apenas princípios expressos no caput do art. 37 da Constituição Federal?",
    "options": [
      "Legalidade, impessoalidade e moralidade.",
      "Celeridade, economicidade e supremacia.",
      "Autotutela, motivação e continuidade.",
      "Hierarquia, publicidade e razoabilidade."
    ],
    "answer": 0,
    "explanation": "Legalidade, impessoalidade, moralidade, publicidade e eficiência são os princípios expressos do caput.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-015",
    "subjectId": "leg",
    "topicId": "leg-lo",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "A Lei Orgânica de um município disciplina, entre outros temas:",
    "options": [
      "a organização política e administrativa municipal.",
      "a estrutura interna do Supremo Tribunal Federal.",
      "a política monetária nacional.",
      "a organização das Forças Armadas."
    ],
    "answer": 0,
    "explanation": "A Lei Orgânica estabelece normas estruturantes do município, nos limites constitucionais.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-016",
    "subjectId": "mt",
    "topicId": "mt-geo",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Qual dos biomas abaixo está presente no território de Mato Grosso?",
    "options": [
      "Tundra.",
      "Pantanal.",
      "Taiga.",
      "Deserto do Saara."
    ],
    "answer": 1,
    "explanation": "O Pantanal ocupa parte do território mato-grossense.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-017",
    "subjectId": "mt",
    "topicId": "mt-hist",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "A fundação de Cuiabá, no século XVIII, relaciona-se historicamente à:",
    "options": [
      "expansão da mineração de ouro.",
      "industrialização automobilística.",
      "produção de petróleo em alto-mar.",
      "construção de Brasília."
    ],
    "answer": 0,
    "explanation": "A descoberta de ouro foi decisiva para a ocupação colonial da região.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-018",
    "subjectId": "etica",
    "topicId": "etica-fund",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "A distinção usual entre ética e moral é que:",
    "options": [
      "ética examina criticamente valores e normas morais.",
      "moral é sempre uma ciência experimental.",
      "ética equivale exclusivamente a leis penais.",
      "moral não se relaciona a costumes."
    ],
    "answer": 0,
    "explanation": "A ética investiga e problematiza valores, deveres e condutas; moral envolve normas e costumes.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-019",
    "subjectId": "etica",
    "topicId": "etica-cid",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Um servidor que trata cidadãos com respeito, independentemente de suas preferências pessoais, demonstra:",
    "options": [
      "favorecimento.",
      "imparcialidade e respeito.",
      "arbitrariedade.",
      "omissão deliberada."
    ],
    "answer": 1,
    "explanation": "O atendimento deve ser respeitoso e impessoal.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-020",
    "subjectId": "relint",
    "topicId": "relint-com",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "A escuta ativa no atendimento ao público envolve:",
    "options": [
      "interromper para acelerar o diálogo.",
      "ouvir com atenção e confirmar a compreensão.",
      "evitar perguntas de esclarecimento.",
      "presumir o problema antes de ouvir."
    ],
    "answer": 1,
    "explanation": "Escuta ativa exige atenção, acolhimento e verificação do entendimento.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-021",
    "subjectId": "relint",
    "topicId": "relint-com",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Diante de um conflito entre colegas, a conduta mais adequada é:",
    "options": [
      "divulgar acusações sem apuração.",
      "evitar qualquer diálogo.",
      "buscar diálogo respeitoso e solução objetiva.",
      "impor opinião pela hierarquia informal."
    ],
    "answer": 2,
    "explanation": "A gestão construtiva de conflitos favorece diálogo e solução baseada em fatos.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-022",
    "subjectId": "esp",
    "topicId": "esp-adm",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "A Administração Pública indireta compreende, entre outras entidades:",
    "options": [
      "autarquias e fundações públicas.",
      "somente ministérios e secretarias.",
      "apenas gabinetes parlamentares.",
      "exclusivamente órgãos sem personalidade jurídica."
    ],
    "answer": 0,
    "explanation": "Autarquias e fundações públicas são exemplos de entidades da administração indireta.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-023",
    "subjectId": "esp",
    "topicId": "esp-dadm",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "A presunção de legitimidade dos atos administrativos significa que:",
    "options": [
      "os atos jamais podem ser anulados.",
      "os atos são considerados válidos até prova em contrário.",
      "todo ato dispensa motivação.",
      "a Administração pode agir contra a lei."
    ],
    "answer": 1,
    "explanation": "Trata-se de presunção relativa, que admite contestação.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-024",
    "subjectId": "esp",
    "topicId": "esp-cf",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "A Constituição Federal de 1988 estabelece que os Poderes da União são:",
    "options": [
      "Executivo, Judiciário e Ministério Público.",
      "Legislativo, Executivo e Judiciário.",
      "Legislativo, Tribunal de Contas e Executivo.",
      "Executivo, Defensoria e Legislativo."
    ],
    "answer": 1,
    "explanation": "O art. 2º prevê Legislativo, Executivo e Judiciário como Poderes independentes e harmônicos.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-025",
    "subjectId": "esp",
    "topicId": "esp-camara",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Em regra, uma comissão legislativa pode:",
    "options": [
      "examinar proposições e emitir pareceres.",
      "substituir integralmente a Constituição.",
      "exercer a função jurisdicional do STF.",
      "editar sentenças penais."
    ],
    "answer": 0,
    "explanation": "Comissões examinam matérias e produzem pareceres, observadas suas competências.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-026",
    "subjectId": "esp",
    "topicId": "esp-redacao",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "A redação oficial deve privilegiar:",
    "options": [
      "ambiguidade e linguagem emotiva.",
      "clareza, concisão e impessoalidade.",
      "gírias e opiniões pessoais.",
      "metáforas extensas e informalidade."
    ],
    "answer": 1,
    "explanation": "Documentos oficiais devem transmitir informação com clareza, concisão e impessoalidade.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-027",
    "subjectId": "esp",
    "topicId": "esp-arq",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "A classificação de documentos arquivísticos deve considerar, prioritariamente:",
    "options": [
      "a preferência estética do servidor.",
      "as funções e atividades que originaram os documentos.",
      "apenas o tamanho do papel.",
      "a ordem alfabética dos nomes próprios."
    ],
    "answer": 1,
    "explanation": "A classificação arquivística relaciona os documentos às funções e atividades de origem.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-028",
    "subjectId": "esp",
    "topicId": "esp-atend",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "No atendimento ao cidadão, é adequada a conduta de:",
    "options": [
      "divulgar dados pessoais de terceiros sem fundamento.",
      "fornecer informações claras dentro das atribuições do setor.",
      "prometer decisões que não dependem do atendente.",
      "recusar atendimento por discordância pessoal."
    ],
    "answer": 1,
    "explanation": "Atendimento adequado requer clareza, respeito e observância das competências e da privacidade.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-029",
    "subjectId": "esp",
    "topicId": "esp-cont",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Na execução orçamentária da despesa pública, a sequência usual das etapas é:",
    "options": [
      "liquidação, pagamento e empenho.",
      "pagamento, empenho e liquidação.",
      "empenho, liquidação e pagamento.",
      "pagamento, liquidação e empenho."
    ],
    "answer": 2,
    "explanation": "A despesa orçamentária percorre, em regra, empenho, liquidação e pagamento.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-N-030",
    "subjectId": "esp",
    "topicId": "esp-hst",
    "origin": "importada",
    "difficulty": "medio",
    "statement": "Uma medida preventiva de segurança no ambiente de trabalho é:",
    "options": [
      "obstruir rotas de fuga.",
      "ignorar orientações de emergência.",
      "manter rotas de evacuação desobstruídas.",
      "desativar equipamentos de proteção."
    ],
    "answer": 2,
    "explanation": "Rotas de fuga livres integram medidas básicas de prevenção e emergência.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-001",
    "subjectId": "lp",
    "topicId": "lp-leitura",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Leia: 'A publicidade dos atos administrativos é condição necessária, mas não suficiente, para o controle social efetivo.' Pode-se inferir corretamente que:",
    "options": [
      "sem publicidade o controle social efetivo fica comprometido, mas a publicidade isolada não o assegura.",
      "toda publicação garante automaticamente controle social.",
      "o controle social dispensa informações públicas.",
      "a publicidade é irrelevante para a fiscalização cidadã."
    ],
    "answer": 0,
    "explanation": "Condição necessária não equivale a condição suficiente.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-002",
    "subjectId": "lp",
    "topicId": "lp-morfo",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Assinale a alternativa integralmente correta quanto à regência e ao emprego da crase.",
    "options": [
      "O relatório fez referência à normas internas.",
      "A comissão assistiu à apresentação e procedeu à análise dos dados.",
      "O servidor obedeceu à todos os prazos.",
      "A chefia informou à equipe de que o prazo mudou."
    ],
    "answer": 1,
    "explanation": "Assistir a (ver) e proceder a exigem preposição; os substantivos femininos admitem artigo.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-003",
    "subjectId": "lp",
    "topicId": "lp-morfo",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Assinale a alternativa em que as duas orações apresentam concordância correta.",
    "options": [
      "Fazem cinco meses que houveram mudanças.",
      "Devem existir novas normas e podem surgir dúvidas.",
      "Houveram reclamações e devem haver providências.",
      "Existe muitas pendências e fazem dias que aguardam."
    ],
    "answer": 1,
    "explanation": "Existir e surgir são pessoais; haver existencial e fazer temporal são impessoais.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-004",
    "subjectId": "lp",
    "topicId": "lp-pont",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "No período 'A comissão encaminhou o relatório à Mesa, que o devolveu para ajustes', o pronome 'o' retoma:",
    "options": [
      "a comissão.",
      "a Mesa.",
      "o relatório.",
      "os ajustes."
    ],
    "answer": 2,
    "explanation": "O pronome oblíquo masculino singular retoma 'o relatório'.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-005",
    "subjectId": "lp",
    "topicId": "lp-sem",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Em 'Embora o prazo fosse curto, os servidores concluíram a análise', a oração iniciada por 'embora' exprime:",
    "options": [
      "causa.",
      "concessão.",
      "finalidade.",
      "consequência."
    ],
    "answer": 1,
    "explanation": "'Embora' introduz concessão, isto é, fato que não impede o resultado.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-006",
    "subjectId": "rlm",
    "topicId": "rlm-conj",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Em 140 candidatos, 65 estudam Português, 60 Matemática e 50 Informática; 25 estudam Português e Matemática, 20 Português e Informática, 15 Matemática e Informática; 10 estudam as três. Quantos não estudam nenhuma?",
    "options": [
      "5",
      "10",
      "15",
      "20"
    ],
    "answer": 2,
    "explanation": "Pela inclusão-exclusão, a união é 65+60+50−25−20−15+10=125. Logo, 140−125=15.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-007",
    "subjectId": "rlm",
    "topicId": "rlm-prop",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "A proposição 'Se o relatório foi aprovado, então foi publicado' equivale logicamente a:",
    "options": [
      "Se não foi aprovado, então não foi publicado.",
      "Se foi publicado, então foi aprovado.",
      "Se não foi publicado, então não foi aprovado.",
      "O relatório foi aprovado e não publicado."
    ],
    "answer": 2,
    "explanation": "A contrapositiva de P→Q é ¬Q→¬P.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-008",
    "subjectId": "rlm",
    "topicId": "rlm-quant",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "A negação de 'Todo servidor que revisa a norma compreende o procedimento' é:",
    "options": [
      "Nenhum servidor que revisa a norma compreende o procedimento.",
      "Existe servidor que revisa a norma e não compreende o procedimento.",
      "Todo servidor não revisa a norma.",
      "Existe servidor que não revisa a norma e compreende o procedimento."
    ],
    "answer": 1,
    "explanation": "A negação de ∀x(R→C) é ∃x(R∧¬C).",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-009",
    "subjectId": "rlm",
    "topicId": "rlm-quant",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Uma comissão escolherá presidente, relator e secretário entre 7 membros, sem acumulação de funções. Quantas distribuições são possíveis?",
    "options": [
      "35",
      "105",
      "210",
      "343"
    ],
    "answer": 2,
    "explanation": "São funções distintas: 7×6×5 = 210.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-010",
    "subjectId": "rlm",
    "topicId": "rlm-quant",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Uma urna tem 4 bolas azuis, 3 vermelhas e 2 verdes. Retiram-se duas sem reposição. Qual a probabilidade de ambas serem azuis?",
    "options": [
      "1/6",
      "2/9",
      "1/4",
      "1/3"
    ],
    "answer": 0,
    "explanation": "P = (4/9)×(3/8)=12/72=1/6.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-011",
    "subjectId": "info",
    "topicId": "info-office",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Em uma planilha, a fórmula =$A1+B$2, copiada da célula C3 para D4, transforma-se em:",
    "options": [
      "=$A2+C$2",
      "=$B2+C$3",
      "=$A1+B$2",
      "=$B1+C$2"
    ],
    "answer": 0,
    "explanation": "O deslocamento é +1 coluna e +1 linha; $A fixa coluna, $2 fixa linha.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-012",
    "subjectId": "info",
    "topicId": "info-rede",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Um usuário recebe mensagem solicitando atualização urgente de senha por link desconhecido. A conduta mais segura é:",
    "options": [
      "clicar imediatamente por causa da urgência.",
      "responder com a senha atual.",
      "abrir o serviço pelo endereço oficial conhecido e verificar a solicitação.",
      "desativar autenticação multifator para concluir o procedimento."
    ],
    "answer": 2,
    "explanation": "A verificação por canal independente reduz o risco de phishing.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-013",
    "subjectId": "info",
    "topicId": "info-rede",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "A estratégia de backup 3-2-1 recomenda, em sua formulação clássica:",
    "options": [
      "três senhas, dois usuários e um administrador.",
      "três cópias dos dados, dois tipos de mídia e uma cópia fora do local.",
      "três antivírus, dois roteadores e uma VPN.",
      "três pastas locais sem redundância externa."
    ],
    "answer": 1,
    "explanation": "A regra 3-2-1 promove redundância e proteção contra perda localizada.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-014",
    "subjectId": "esp",
    "topicId": "esp-cf",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Segundo a Constituição Federal, compete precipuamente ao Supremo Tribunal Federal:",
    "options": [
      "a guarda da Constituição.",
      "o julgamento de todas as causas municipais em primeira instância.",
      "a elaboração de leis orgânicas municipais.",
      "a administração direta de todas as câmaras municipais."
    ],
    "answer": 0,
    "explanation": "O art. 102 atribui ao STF, precipuamente, a guarda da Constituição.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-015",
    "subjectId": "leg",
    "topicId": "leg-lo",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "No modelo constitucional brasileiro, a autonomia municipal compreende:",
    "options": [
      "soberania internacional própria.",
      "capacidade de auto-organização nos limites constitucionais.",
      "competência para emitir moeda.",
      "poder para afastar direitos fundamentais."
    ],
    "answer": 1,
    "explanation": "O município possui autonomia política, administrativa e financeira, não soberania.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-016",
    "subjectId": "mt",
    "topicId": "mt-geo",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Sobre os biomas presentes em Mato Grosso, assinale a correta.",
    "options": [
      "O estado possui somente Cerrado.",
      "Amazônia, Cerrado e Pantanal estão presentes no estado.",
      "O Pantanal ocupa todo o território estadual.",
      "A Caatinga é o único bioma do estado."
    ],
    "answer": 1,
    "explanation": "Mato Grosso reúne áreas de Amazônia, Cerrado e Pantanal.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-017",
    "subjectId": "mt",
    "topicId": "mt-hist",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "A chamada Rusga, ocorrida em Cuiabá em 1834, relaciona-se ao contexto:",
    "options": [
      "das disputas políticas do período regencial.",
      "da proclamação da República em 1889.",
      "da transferência da capital federal em 1960.",
      "da Guerra de Canudos."
    ],
    "answer": 0,
    "explanation": "A Rusga integra o contexto de conflitos políticos do período regencial.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-018",
    "subjectId": "etica",
    "topicId": "etica-fund",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Uma abordagem deontológica avalia a correção moral de uma conduta sobretudo a partir:",
    "options": [
      "da quantidade de pessoas que aprovam a ação.",
      "de deveres e princípios que orientam a ação.",
      "do lucro financeiro obtido.",
      "do acaso e da conveniência pessoal."
    ],
    "answer": 1,
    "explanation": "Deontologia enfatiza deveres, normas e princípios morais.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-019",
    "subjectId": "etica",
    "topicId": "etica-cid",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Um agente público recebe pedido de favorecimento de conhecido em procedimento administrativo. A decisão eticamente adequada é:",
    "options": [
      "priorizar o conhecido para evitar conflito.",
      "aplicar critérios impessoais e regras do procedimento.",
      "ocultar o pedido e alterar o registro.",
      "condicionar a análise a um benefício pessoal."
    ],
    "answer": 1,
    "explanation": "Impessoalidade e integridade exigem critérios objetivos e respeito às regras.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-020",
    "subjectId": "relint",
    "topicId": "relint-com",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Em uma equipe com divergência sobre prazos, a postura mais assertiva é:",
    "options": [
      "expor fatos e necessidades com respeito e ouvir propostas.",
      "atribuir culpa antes de apurar.",
      "silenciar até que o conflito se agrave.",
      "usar ironias para pressionar colegas."
    ],
    "answer": 0,
    "explanation": "Assertividade combina clareza, respeito e abertura ao diálogo.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-021",
    "subjectId": "relint",
    "topicId": "relint-com",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Um feedback construtivo é mais eficaz quando:",
    "options": [
      "generaliza características pessoais.",
      "descreve comportamento observável e seu impacto, com sugestões objetivas.",
      "é feito somente em público para constranger.",
      "evita qualquer exemplo concreto."
    ],
    "answer": 1,
    "explanation": "Feedback baseado em fatos e ações específicas favorece melhoria.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-022",
    "subjectId": "esp",
    "topicId": "esp-orgadm",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Quando a Administração distribui competências entre órgãos de uma mesma pessoa jurídica, ocorre:",
    "options": [
      "descentralização por outorga.",
      "desconcentração administrativa.",
      "privatização obrigatória.",
      "criação necessária de autarquia."
    ],
    "answer": 1,
    "explanation": "Desconcentração distribui competências internamente, sem criar nova pessoa jurídica.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-023",
    "subjectId": "esp",
    "topicId": "esp-dadm",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "O poder disciplinar permite à Administração, observados o devido processo e as competências legais:",
    "options": [
      "punir qualquer cidadão sem vínculo jurídico específico.",
      "apurar e sancionar infrações funcionais de servidores.",
      "criar crimes por decreto.",
      "revogar decisões judiciais transitadas em julgado."
    ],
    "answer": 1,
    "explanation": "Poder disciplinar relaciona-se à apuração e sanção de infrações em vínculos específicos.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-024",
    "subjectId": "esp",
    "topicId": "esp-dadm",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Um ato administrativo vinculado é aquele em que:",
    "options": [
      "a Administração dispõe de liberdade ilimitada.",
      "a lei predetermina os requisitos para sua prática, sem margem de escolha quanto aos elementos vinculados.",
      "a motivação nunca pode ser exigida.",
      "o agente pode ignorar a finalidade legal."
    ],
    "answer": 1,
    "explanation": "No ato vinculado, a atuação está estritamente condicionada aos requisitos legais.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-025",
    "subjectId": "esp",
    "topicId": "esp-dadm",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Assinale a distinção correta entre anulação e revogação de atos administrativos.",
    "options": [
      "Anulação decorre de ilegalidade; revogação, de conveniência e oportunidade nos limites legais.",
      "Ambas dependem exclusivamente de decisão judicial.",
      "Revogação sempre corrige ilegalidade originária.",
      "Anulação é exclusiva de atos válidos e perfeitos."
    ],
    "answer": 0,
    "explanation": "Anulação enfrenta ilegalidade; revogação retira ato válido por mérito administrativo.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-026",
    "subjectId": "esp",
    "topicId": "esp-camara",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "No processo legislativo, a sanção do chefe do Executivo, quando cabível, representa:",
    "options": [
      "a concordância com o projeto aprovado pelo Legislativo.",
      "a decisão final do Poder Judiciário.",
      "a publicação obrigatória do texto no Diário Oficial.",
      "a iniciativa privativa de uma comissão."
    ],
    "answer": 0,
    "explanation": "Sanção é manifestação de concordância do Executivo, nas hipóteses previstas.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-027",
    "subjectId": "esp",
    "topicId": "esp-proc",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Na redação de normas, a clareza e a precisão são favorecidas por:",
    "options": [
      "uso de termos vagos sem definição.",
      "uniformidade terminológica e organização lógica dos dispositivos.",
      "repetição de sinônimos com sentidos variados.",
      "frases propositalmente ambíguas."
    ],
    "answer": 1,
    "explanation": "Técnica legislativa exige linguagem precisa, coerência e sistematização.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-028",
    "subjectId": "esp",
    "topicId": "esp-arq",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "A teoria das três idades dos arquivos distingue:",
    "options": [
      "arquivos digitais, impressos e orais.",
      "arquivos correntes, intermediários e permanentes.",
      "arquivos públicos, privados e secretos.",
      "arquivos administrativos, judiciais e históricos apenas."
    ],
    "answer": 1,
    "explanation": "A teoria organiza documentos segundo fases de uso e valor: corrente, intermediária e permanente.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-029",
    "subjectId": "esp",
    "topicId": "esp-cont",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "Na despesa pública, a liquidação consiste em:",
    "options": [
      "reservar dotação antes da contratação.",
      "verificar o direito adquirido pelo credor com base nos títulos e documentos comprobatórios.",
      "transferir recursos ao fornecedor antes de qualquer conferência.",
      "cancelar automaticamente o empenho."
    ],
    "answer": 1,
    "explanation": "A liquidação verifica o direito do credor e os elementos da obrigação.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  },
  {
    "id": "SEL-D-030",
    "subjectId": "esp",
    "topicId": "esp-hst",
    "origin": "importada",
    "difficulty": "dificil",
    "statement": "A hierarquia de controles de riscos ocupacionais prioriza, em termos gerais:",
    "options": [
      "equipamentos individuais antes de qualquer outra medida.",
      "eliminação do perigo antes de medidas administrativas e EPI.",
      "somente advertências verbais.",
      "aceitação do risco sem análise."
    ],
    "answer": 1,
    "explanation": "Eliminar o perigo é preferível a depender apenas de proteção individual.",
    "source": "Banco enviado pelo usuário: inéditas inspiradas no estilo Selecon, não oficiais, revisão editorial recomendada"
  }
];
