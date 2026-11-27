// Gera os três protótipos YOLO e o índice. Uso: node auditions/yolo/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pageA } from './a.mjs';
import { pageB } from './b.mjs';
import { pageC } from './c.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
fs.writeFileSync(path.join(dir, 'a-linhagem.html'), pageA);
fs.writeFileSync(path.join(dir, 'b-mesa.html'), pageB);
fs.writeFileSync(path.join(dir, 'c-planilha.html'), pageC);

const cards = [
  {
    f: 'a-linhagem.html', name: 'A · Linhagem',
    intent: 'Você voa por uma pipeline: cada projeto é um portão no caminho, do dado solto à ação. Continua a família azul e escura do site de hoje.',
    hint: 'Azul de sinal (#58a6ff) e ciano sobre azul-marinho profundo.',
    beats: [
      ['Início', 'rolagem', 'a câmera entra na pipeline'],
      ['Leitura de disparo', 'rolagem', 'o portão se aproxima e a pergunta é lida'],
      ['Reddir', 'rolagem', 'continua a viagem, sem ação'],
      ['Código M', 'ação: segurar', 'o visitante liga a pipeline; é o ponto em que a história depende dele'],
      ['Planning Intelligence', 'rolagem', 'o portão final antes da ação'],
      ['Fora do expediente e contato', 'rolagem', 'a câmera chega ao fim do caminho'],
    ],
    cost: 'Hoje: canvas 2D e ~6 KB de script. Em produção: um mundo 3D em tempo real (Three.js, portões modelados no Blender), com qualidade por dispositivo. Estimativa: 8 a 14 MB depois de rolar tudo, ~3 MB antes da primeira vista; 4 a 6 dias. Sem 3D (rejeitado, sem WebGL, ou movimento reduzido): quadro estático com o texto completo.',
    tier: 'YOLO · protótipo leve',
  },
  {
    f: 'b-mesa.html', name: 'B · Mesa de controle',
    intent: 'A mesa de operação onde você começou: painel de partidas e tíquetes empilhados. Cada ferramenta é um tíquete que se despacha. Claro, quente, tátil.',
    hint: 'Laranja de sinal (#d9431a) sobre papel quente e tinta preta.',
    beats: [
      ['Início', 'rolagem', 'o painel de partidas gira e assenta'],
      ['Leitura de disparo', 'ação: arrastar', 'o canhoto se rasga e vira DESPACHADO'],
      ['Reddir', 'ação: arrastar', 'mesma ação, por tíquete'],
      ['Código M', 'ação: arrastar', 'mesma ação, por tíquete'],
      ['Planning Intelligence', 'ação: arrastar', 'mesma ação, por tíquete'],
      ['Fora do expediente e contato', 'rolagem', 'os tíquetes empilhados dão lugar à conversa'],
    ],
    cost: 'Hoje: CSS sticky e ~3 KB de script. Em produção: tíquetes e mesa como arte renderizada em 3D, física de arrastar (~100 KB de biblioteca) e som de carimbo, só depois do toque (~2 a 3 MB). Estimativa: 9 a 13 MB depois de rolar tudo; 5 a 7 dias. Sem a física: o tíquete só mostra o carimbo ao toque.',
    tier: 'YOLO · protótipo leve',
  },
  {
    f: 'c-planilha.html', name: 'C · Planilha viva',
    intent: 'O site é uma planilha. Cada projeto é uma aba com as três perguntas nas linhas, e o botão Atualizar faz o que era manual virar automático, como na vida real.',
    hint: 'Verde de planilha (#1f6b45) e vermelho de alerta sobre papel quadriculado.',
    beats: [
      ['Início', 'rolagem', 'a barra de fórmulas acompanha o que está em foco'],
      ['Leitura de disparo', 'ação: clicar em Atualizar', 'a onda de recálculo passa e o estado vira automático'],
      ['Reddir', 'ação: clicar em Atualizar', 'idem'],
      ['Código M', 'ação: clicar em Atualizar', 'idem'],
      ['Planning Intelligence', 'ação: clicar em Atualizar', 'idem'],
      ['Fora do expediente e contato', 'rolagem', 'duas abas finais sem ação, depois a conversa'],
    ],
    cost: 'Hoje: CSS e ~2 KB de script. Em produção: pequenos filmes pré-renderizados da planilha se refazendo, uma por aba, e camadas ilustradas. Estimativa: 10 a 16 MB depois de rolar tudo, 1 a 2 MB antes da primeira vista; 4 a 6 dias. Sem filmes: quadro parado e texto completo.',
    tier: 'YOLO · protótipo leve',
  },
];

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Três direções YOLO para o portfólio de Nilson Lopes.">
<title>Auditions YOLO — portfólio de Nilson Lopes</title>
<style>
:root{--bg:#f4f2ec;--ink:#17181a;--mute:#585b60;--line:#cfcbbf;--card:#fbfaf6;--accent:#0f5fd7;--display:"Bahnschrift","Segoe UI",sans-serif;--mono:"Cascadia Mono",Consolas,monospace;--text:"Segoe UI Variable Text","Segoe UI",system-ui,sans-serif}
*{box-sizing:border-box}
body{margin:0;overflow-x:clip;background:var(--bg);color:var(--ink);font:1.0625rem/1.55 var(--text)}
.ic{width:1.1em;height:1.1em;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
header,main{max-width:76rem;margin:0 auto;padding:0 clamp(1rem,4vw,2.5rem)}
header{padding-top:3rem}
h1{font:700 clamp(2rem,5vw,3.4rem)/1 var(--display);letter-spacing:-.03em;margin:0 0 .8rem}
.lead{max-width:46rem;color:var(--mute);margin:0 0 .8rem}
.warn{max-width:46rem;border-left:4px solid var(--accent);padding:.5rem 1rem;background:var(--card);margin:1rem 0 2rem}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(21rem,100%),1fr));gap:1.5rem;padding-bottom:4rem}
article{background:var(--card);border:1px solid var(--ink);padding:1.4rem;display:flex;flex-direction:column;gap:.8rem}
article h2{font:700 1.6rem/1.1 var(--display);margin:0}
.tier{font:.85rem var(--mono);color:var(--accent);margin:0}
table{border-collapse:collapse;width:100%;font-size:.92rem}
th,td{text-align:left;padding:.35rem .4rem;border-top:1px solid var(--line);vertical-align:top}
th{font-weight:600}
.grid>*{min-width:0}
.cost{font-size:.92rem;color:var(--mute);margin:0}
.open{display:inline-flex;gap:.45rem;align-items:center;margin-top:auto;padding:.7rem 1rem;background:var(--ink);color:var(--bg);text-decoration:none;font-weight:600;border-radius:4px;width:fit-content}
.open:hover{background:var(--accent)}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
</style>
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><symbol id="i-ur" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></symbol></defs></svg>
<header>
  <h1>Auditions YOLO</h1>
  <p class="lead">Três direções para o portfólio de Nilson Lopes, com o mesmo conteúdo em cada uma. A Alloha Planejamento ocupa a maior parte; cada ferramenta responde às três perguntas (problema, como foi resolvido, resultado).</p>
  <p class="warn"><strong>Rascunho.</strong> Os textos das ferramentas são qualitativos e precisam da sua confirmação. Só o retrato e o painel do Planning Intelligence são imagens (as suas). Os protótipos só têm texto em português, e as fontes são as do sistema; as finais entram no brief.</p>
</header>
<main>
  <div class="grid">
${cards.map((c) => `
    <article>
      <h2>${c.name}</h2>
      <p class="tier">${c.tier}</p>
      <p>${c.intent}</p>
      <p class="cost"><strong>Cor:</strong> ${c.hint}</p>
      <table>
        <caption style="text-align:left;font-weight:700;padding:.3rem .4rem">Mapa dos momentos</caption>
        <thead class="sr" hidden><tr><th>Momento</th><th>Avança por</th><th>Por quê</th></tr></thead>
        <tbody>${c.beats.map(([a, b, d]) => `<tr><th scope="row">${a}</th><td>${b}</td><td>${d}</td></tr>`).join('')}</tbody>
      </table>
      <p class="cost"><strong>Custo:</strong> ${c.cost}</p>
      <a class="open" href="${c.f}">Abrir ${c.name.split(' · ')[0]} <svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-ur"/></svg></a>
    </article>`).join('')}
  </div>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(dir, 'index.html'), html);
console.log('ok');
