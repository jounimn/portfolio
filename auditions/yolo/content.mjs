// Conteúdo único dos três protótipos: só a identidade varia.
// Textos qualitativos (sem números inventados). Rascunho: confirmar antes da produção.
export const C = {
  name: 'Nilson Lopes',
  title: 'Nilson Lopes — Dados, BI e Automação',
  nav: [['#projetos', 'Projetos'], ['#lab', 'Fora do expediente'], ['#contato', 'Contato']],
  hero: {
    h1: 'Eu conecto operação, dados e automação.',
    intro:
      'Sou Nilson. Minha trajetória passou pelo design, por redes e por operações antes de chegar a dados e BI. Essa experiência me ajuda a entender o problema de quem usa a informação e a construir análises, pipelines e automações que tornam o trabalho mais confiável.',
    flow: ['Operação', 'Dados', 'Ação'],
    portraitAlt: 'Retrato de Nilson Lopes, com fundo azul.',
  },
  questions: ['Qual problema isso resolvia?', 'Como foi resolvido?', 'Qual foi o resultado?'],
  alloha: {
    title: 'Alloha Planejamento',
    lead:
      'A maior parte do que construí está aqui, no dia a dia de Planejamento e MIS. O código é da empresa e fica privado: mostro o problema e o caminho até a solução, não os dados.',
  },
  projects: [
    {
      id: 'leitura',
      name: 'Leitura de disparo',
      node: 'Leitura',
      kind: 'Coletor de relatórios',
      problem: 'Os relatórios de disparo chegavam soltos e eram reunidos e lidos à mão, a cada rodada.',
      steps: [
        'Mapeei como o relatório chega e o que cada leitura precisa mostrar.',
        'Escrevi um coletor que lê os relatórios e padroniza os campos.',
        'Reuni tudo num só lugar, pronto para consulta.',
      ],
      result:
        'A leitura deixou de depender de montagem manual. O time passou a olhar o dado já organizado, em vez de preparar o dado.',
    },
    {
      id: 'reddir',
      name: 'Atualização da apresentação Reddir',
      node: 'Reddir',
      kind: 'Automação de apresentação',
      problem: 'A apresentação de acompanhamento era refeita à mão a cada atualização.',
      steps: [
        'Listei o que mudava a cada ciclo e o que ficava fixo.',
        'Separei a fonte dos dados do desenho da apresentação.',
        'Automatizei: os números entram e a apresentação se refaz.',
      ],
      result: 'A atualização deixou de ser uma tarefa de cada ciclo e passou a rodar sozinha.',
    },
    {
      id: 'm',
      name: 'Parametrizador de código M',
      node: 'Código M',
      kind: 'Ferramenta para Power Query',
      problem:
        'Cada consulta do Power Query tinha valores presos no código: trocar uma fonte ou um filtro era reescrever e conferir à mão.',
      steps: [
        'Identifiquei o que mudava de uma consulta para outra.',
        'Tirei esses valores do código e criei parâmetros com nome.',
        'Montei a ferramenta que gera o código M a partir dos parâmetros.',
      ],
      result: 'Mudar uma fonte virou ajustar um parâmetro. Menos retrabalho e menos erro de digitação.',
    },
    {
      id: 'pi',
      name: 'Planning Intelligence',
      node: 'Planning',
      kind: 'Pipeline de dados',
      problem:
        'O planejamento morava numa árvore de planilhas enorme, difícil de rastrear e de reaproveitar em análises.',
      steps: [
        'Li a estrutura da árvore e defini o que cada nível significa.',
        'Construí uma pipeline versionada, independente de provedor e coberta por testes.',
        'Cada valor sai com a sua origem: dá para voltar do número até a célula.',
      ],
      result:
        'Um conjunto de dados estruturado e rastreável. A amostra pública é sanitizada; nomes e dados são fictícios.',
      image: '../../site/assets/images/planning-intelligence.png',
      imageAlt: 'Painel do Planning Intelligence com indicadores e gráficos usando nomes e dados fictícios.',
      href: 'https://github.com/jounimn/website-analytics',
    },
  ],
  lab: {
    title: 'Fora do expediente',
    lead: 'Um projeto público, feito por conta própria.',
    items: [
      {
        id: 'dnd',
        name: 'df-DnD',
        kind: 'Fichas de D&D por edição · em pausa',
        problem:
          'Cada edição de D&D (AD&D 2e, 5e 2014, 5e 2024) tem regras diferentes, e fichas genéricas erram as contas de uma ou de outra.',
        steps: [
          'Modelei as regras de cada edição separadamente.',
          'Montei o app em Next.js com Supabase, com a ficha pronta para imprimir.',
          'Deixei a edição como escolha do usuário, sem misturar regras.',
        ],
        result: 'O projeto está em pausa. Segue público como registro do que já foi construído.',
        href: null,
      }
    ],
  },
  contact: {
    title: 'Vamos tornar seu processo mais confiável?',
    body: 'Se você procura alguém para RPA, análise de dados, BI ou automação, conte o que a equipe precisa resolver. A conversa começa pelo problema.',
    cta: 'Fale comigo no LinkedIn',
    linkedin: 'https://www.linkedin.com/in/nilsondgwm/',
    github: 'https://github.com/jounimn',
    footer: 'Dados, BI e automação. Rio de Janeiro, BR.',
  },
};

export const ICONS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<symbol id="i-arrow-ur" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></symbol>
<symbol id="i-arrow-r" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
<symbol id="i-branch" viewBox="0 0 24 24"><path d="M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a9 9 0 0 1-9 9"/></symbol>
<symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 5 5L20 7"/></symbol>
<symbol id="i-hold" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></symbol>
<symbol id="i-refresh" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/></symbol>
<symbol id="i-grip" viewBox="0 0 24 24"><path d="M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01"/></symbol>
</defs></svg>`;

export const icon = (id, cls = '') =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-${id}"/></svg>`;

export const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
