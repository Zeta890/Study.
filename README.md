# MISSÃO 11 — Nossa Jornada até a Aprovação

Plataforma de preparação para o concurso de Técnico Legislativo da Câmara Municipal de Cuiabá (edital nº 001/2026-CMC, banca Selecon, prova em 20/12/2026). Uso exclusivo de Pedro Henrique Castoldi e Elizabeth Taynara Andrade.

## Como rodar

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # checagem de tipos + build de produção
npm run preview    # serve o build
```

Em hospedagem estática, configure o fallback de SPA para `index.html` (as rotas usam `BrowserRouter`).

## O que está implementado

- **Perfis separados**: entrada por perfil, com histórico, cronograma, anotações, redações e simulados independentes.
- **Hoje**: contador regressivo (dias, horas, minutos) no fuso America/Cuiaba, missão do dia com 3 a 4 blocos somando o tempo líquido disponível, progresso, visão do casal, consistência compartilhada e mensagem gerada a partir dos dados.
- **Plano**: cronograma de 23/11 a 19/12 com a divisão 60/45/40/35 minutos, etapas do período, dias com ajuste de disponibilidade e replanejamento que divide tarefas atrasadas e explica o motivo de cada uma. Carga máxima por dia: 180 min mais reserva de 30. O dia 19/12 é revisão leve.
- **Estudo**: árvore de conteúdos do edital com status por assunto, anotações, treino com explicação, revisão espaçada (caixas 1 a 5), diagnóstico que ajusta pontos de atenção e importação de banco de questões em JSON.
- **Simulados**: sorteio do banco, cronômetro, resultado salvo e nota estimada (estimativa, não é nota oficial). Redação com lista de critérios do edital e estimativa de linhas.
- **Progresso**: gráficos com Recharts (horas planejadas e realizadas, aproveitamento por área e disciplina, evolução nos simulados).
- **Casal**: metas conjuntas que somam apenas registros de cada pessoa, e controle de privacidade do progresso.
- **Ajustes**: disponibilidade padrão e por dia, backup em JSON e exclusão dos dados do perfil.
- Tema escuro e claro, navegação lateral no desktop e inferior no celular, respeito a `prefers-reduced-motion`, foco visível.

## Limitações conhecidas

- **Autenticação e banco**: os dados ficam no `localStorage` do navegador (`src/lib/store.tsx`). A integração com Supabase Auth e PostgreSQL ainda não foi feita. O estado está isolado no store para facilitar essa troca.
- **Professor de IA**: não implementado. Precisa de um endpoint de backend, com a chave de API fora do frontend.
- **Conteúdo do edital**: os nomes das disciplinas de Básicos e Gerais seguem o resumo do Anexo V. Os 16 itens de Específicos vêm do plano do projeto e não foram conferidos literalmente com o edital; o resumo consultado cita 13 itens. Confira em `src/lib/content.ts` antes de usar como roteiro oficial.
- **Questões**: o app traz apenas 14 questões de exemplo, criadas para testar o fluxo. Não são questões da Selecon. Importe o seu banco pela aba Estudo > Importar.
- **Horário da prova**: 13:00 é uma referência. O horário exato vem no Cartão de Confirmação. Ajuste `EXAM.startTime` em `src/lib/content.ts`.
- **Contador**: mostra o tempo exato até a prova, então no dia 23/11 aparecem 26 dias e 23 horas. Contar dias de calendário daria 27.
- **Componentes**: a interface usa componentes próprios em Tailwind, não shadcn/ui, para manter o bundle enxuto.

## Estrutura

```
src/
  lib/        conteúdo do edital, banco de questões, datas, cronograma, estatísticas, store
  components/ layout (sidebar, topbar, navegação móvel) e componentes de UI
  pages/      Login, Hoje, Plano, Estudo, Simulados, Progresso, Casal, Ajustes
```
