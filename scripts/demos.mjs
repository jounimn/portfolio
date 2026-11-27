// Demonstrações animadas por projeto: uma fibra com três nós (entra, transforma, sai) e o mesmo pulso
// percorrendo as três etapas. Cada visual mostra o mecanismo da ferramenta, não dados reais.
// As legendas vêm do site-content (chaves `<id>s0..s2`) e são traduzidas em tempo de execução.

const idx = (n, f) => Array.from({ length: n }, (_, i) => f(i));

// pequenos desvios fixos, para a desordem parecer desordem e não aleatória a cada build
const JIT = [[-9, 7], [11, -5], [-6, -9], [8, 8], [-12, 3], [5, -8], [10, 6], [-4, 9], [7, -4], [-10, -6], [6, 10], [-8, 5]];

const VIS = {
  p0: () => [
    `<div class="p0a">${idx(4, (i) => `<b style="--n:${i}"></b>`).join('')}</div>`,
    `<div class="p0b">${idx(12, (i) => `<i style="--n:${i};--dx:${JIT[i][0]}px;--dy:${JIT[i][1]}px"></i>`).join('')}</div>`,
    `<div class="p0c"><u></u>${idx(5, (i) => `<i style="--n:${i}"></i>`).join('')}</div>`,
  ],
  p1: () => [
    `<div class="p1a">${idx(12, (i) => `<i style="--n:${i}"></i>`).join('')}</div>`,
    `<div class="p1b"><i class="ti"></i><i class="gr"></i><i class="tx"></i><i class="tx"></i></div>`,
    `<div class="p1c"><u></u><span class="bars">${[[.62, .5], [.9, .42], [.66, .78], [.95, .6]].map(([a, b], i) => `<i style="--n:${i};--a:${a};--b:${b}"></i>`).join('')}</span><s></s><s></s></div>`,
  ],
  p2: () => [
    `<div class="p2a"><code>Origem = Arquivo(<mark class="lit">"…\\jan.xlsx"</mark>)</code><code>Linhas = Filtrar(Status = <mark class="lit">"Ativo"</mark>)</code></div>`,
    `<div class="p2b"><b style="--n:0">fonte</b><b style="--n:1">filtro</b></div>`,
    `<div class="p2c"><code style="--n:0">Origem = Arquivo(<mark class="par">fonte</mark>)</code><code style="--n:1">Linhas = Filtrar(Status = <mark class="par">filtro</mark>)</code></div>`,
  ],
  p3: () => {
    const L1 = [[30, 45], [80, 45], [130, 45]];
    const L2 = [[15, 90], [45, 90], [65, 90], [95, 90], [115, 90], [145, 90]];
    const par = [0, 0, 1, 1, 2, 2];
    const lines = [...L1.map(([x, y]) => `<path d="M80 10 L${x} ${y}"/>`), ...L2.map(([x, y], i) => `<path d="M${L1[par[i]][0]} 45 L${x} ${y}"/>`)].join('');
    const dots = [[80, 10], ...L1, ...L2].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === 0 ? 6 : i < 4 ? 5 : 4}" style="--n:${i}"/>`).join('');
    const tree = `<g class="tr">${lines}</g><g class="dt">${dots}</g>`;
    const bands = [[0, 28], [30, 30], [75, 30]].map(([y, h], i) => `<rect class="bd" style="--n:${i}" x="0" y="${y}" width="160" height="${h}"/>`).join('');
    return [
      `<svg viewBox="0 0 160 130" class="p3a" focusable="false">${tree}</svg>`,
      `<svg viewBox="0 0 160 130" class="p3b" focusable="false">${bands}${tree}</svg>`,
      `<svg viewBox="0 0 160 130" class="p3c" focusable="false">${tree}<rect class="val" x="62" y="112" width="36" height="14" rx="2"/><path class="trace" d="M80 112 L95 92 L80 47 L80 12"/><circle class="hit" cx="95" cy="90" r="6"/></svg>`,
    ];
  },
  dnd: ({ k, t }) => [
    `<div class="dna">${['AD&amp;D 2e', '5e 2014', '5e 2024'].map((n, i) => `<b class="e${i}">${n}</b>`).join('')}</div>`,
    `<div class="dnb">${[0, 1, 2].map((r) => `<p class="rw"><span class="lb" ${k(`dRow${r}`)}>${t(`dRow${r}`)}</span><span class="vl">${[0, 1, 2].map((e) => `<em class="v${e}" data-e="${["2e","5e 2014","5e 2024"][e]}" ${k(`dv${r}${e}`)}>${t(`dv${r}${e}`)}</em>`).join('')}</span></p>`).join('')}</div>`,
    `<div class="dnc"><u></u><s></s><s></s><s></s><i class="scan"></i></div>`,
  ],
};

export function demo(id, { k, t }) {
  const vis = VIS[id]({ k, t });
  const cap = (n) => `<figcaption ${k(`${id}s${n}`)}>${t(`${id}s${n}`)}</figcaption>`;
  const node = (n) => `<div class="st"><i class="nd n${n}" aria-hidden="true"></i><div class="vis" aria-hidden="true">${vis[n]}</div>${cap(n)}</div>`;
  return `<figure class="demo d-${id}"><i class="sig" aria-hidden="true"></i>${node(0)}${node(1)}${node(2)}</figure>
      <p class="note" ${k('demoNote')}>${t('demoNote')}</p>`;
}
